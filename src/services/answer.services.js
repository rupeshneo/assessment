import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { Checklist } from './entities/checklist.entity';
import { ChecklistQuestion } from './entities/checklist-question.entity';
import { FileUpload } from './entities/file-upload.entity';
import { Order } from '../order/entities/order.entity';
import { deleteFiles, deleteFilesByPaths } from '../helpers/helper';

@Injectable()
export class AnswersService {
  // private readonly logger = new Logger(AnswersService.name);

  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,

    @InjectRepository(Checklist)
    private readonly checklistRepo: Repository<Checklist>,

    @InjectRepository(ChecklistQuestion)
    private readonly questionRepo: Repository<ChecklistQuestion>,

    @InjectRepository(FileUpload)
    private readonly fileRepo: Repository<FileUpload>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  /* ========================= SUBMIT ANSWERS ========================= */

  async submitAnswer(
    body: any,
    files: Express.Multer.File[],
    user: any,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { orderId, responses } = body;
      const parsedResponses = JSON.parse(responses || '[]');

      const order = await this.orderRepo.findOne({
        where: { id: orderId },
      });

      if (!order) {
        throw new BadRequestException('Invalid orderId');
      }

      const checklist = await this.checklistRepo.findOne({
        where: { orderId },
        relations: ['questions'],
      });

      if (!checklist || !checklist.questions.length) {
        throw new BadRequestException('Checklist not found');
      }

      const questionIds = checklist.questions.map((q) => q.id);
      const validResponses = parsedResponses.filter((r) =>
        questionIds.includes(r.questionId),
      );

      let answer = await this.answerRepo.findOne({
        where: { orderId },
      });

      let existingFiles: FileUpload[] = [];

      if (answer) {
        existingFiles = await this.fileRepo.find({
          where: { answerId: answer.id },
        });
      }

      this.validateResponses(
        checklist,
        validResponses,
        existingFiles,
        files,
      );

      // SAVE ANSWER
      answer = await this.saveAnswer(
        answer,
        validResponses,
        checklist.id,
        orderId,
        user.id,
        queryRunner,
      );

      // SAVE FILES
      await this.saveFiles(
        answer.id,
        files,
        existingFiles,
        checklist,
        queryRunner,
      );

      // UPDATE ORDER STATUS
      await queryRunner.manager.update(
        Order,
        { id: orderId },
        { status: 'inspection_pending' },
      );

      await queryRunner.commitTransaction();

      return {
        message: 'Checklist answers & files submitted successfully',
        answer: {
          ...answer,
          answers: JSON.parse(answer.answers),
        },
        files: await this.fileRepo.find({
          where: { answerId: answer.id },
        }),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      deleteFiles({ files });
      this.logger.error(error.stack);
      throw new InternalServerErrorException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  /* ========================= GET ANSWERS ========================= */

  async getAnswersByOrder(orderId: number) {
    const answer = await this.answerRepo.findOne({
      where: { orderId },
      relations: ['fileUploads'],
      select: {
        id: true,
        answers: true,
      },
    });

    if (!answer) return null;

    return {
      ...answer,
      answers: JSON.parse(answer.answers),
    };
  }

  /* ========================= VALIDATION ========================= */

  private validateResponses(
    checklist: Checklist,
    responses: any[],
    fileUploads: FileUpload[],
    files: Express.Multer.File[],
  ) {
    for (const question of checklist.questions) {
      const response = responses.find(
        (r) => r.questionId === question.id,
      );

      const options = question.options?.map((o) => o.trim()) || [];
      const answers = response?.answers
        ? response.answers.split(',').map((a) => a.trim())
        : [];

      // REQUIRED
      if (question.required) {
        if (!response?.answers && question.type !== 'file') {
          throw new BadRequestException(
            `Answer required for question ${question.id}`,
          );
        }

        if (question.type === 'file') {
          const exists =
            fileUploads.find((f) => f.questionId === question.id) ||
            files?.some(
              (f) => f.fieldname === `question_${question.id}`,
            );

          if (!exists) {
            throw new BadRequestException(
              `File required for question ${question.id}`,
            );
          }
        }
      }

      // TYPE VALIDATION
      switch (question.type) {
        case 'radio':
        case 'checkbox':
        case 'dropdown':
          for (const ans of answers) {
            if (!options.includes(ans)) {
              throw new BadRequestException(
                `Invalid option "${ans}" for question ${question.id}`,
              );
            }
          }
          break;

        case 'number':
          if (answers[0] && isNaN(Number(answers[0]))) {
            throw new BadRequestException(
              `Expected number for question ${question.id}`,
            );
          }
          break;

        case 'date':
        case 'datetime':
          if (answers[0] && isNaN(Date.parse(answers[0]))) {
            throw new BadRequestException(
              `Invalid date for question ${question.id}`,
            );
          }
          break;
      }
    }
  }

  /* ========================= SAVE ANSWER ========================= */

  private async saveAnswer(
    answer: Answer | null,
    responses: any[],
    checklistId: number,
    orderId: number,
    userId: number,
    queryRunner,
  ): Promise<Answer> {
    if (answer) {
      await queryRunner.manager.update(
        Answer,
        { orderId },
        { answers: JSON.stringify(responses) },
      );

      return queryRunner.manager.findOneBy(Answer, {
        id: answer.id,
      });
    }

    const newAnswer = this.answerRepo.create({
      orderId,
      checklistId,
      inspectionManagerId: userId,
      answers: JSON.stringify(responses),
    });

    return queryRunner.manager.save(newAnswer);
  }

  /* ========================= SAVE FILES ========================= */

  private async saveFiles(
    answerId: number,
    files: Express.Multer.File[],
    existingFiles: FileUpload[],
    checklist: Checklist,
    queryRunner,
  ) {
    if (!files?.length) return;

    const toCreate: FileUpload[] = [];
    const toUpdate: { id: number; filePath: string }[] = [];
    const deletePaths: string[] = [];

    for (const file of files) {
      const questionId = Number(file.fieldname.split('_')[1]);

      const existing = existingFiles.find(
        (f) => f.questionId === questionId,
      );

      if (existing) {
        deletePaths.push(existing.filePath);
        toUpdate.push({
          id: existing.id,
          filePath: file.path,
        });
        continue;
      }

      if (
        checklist.questions.some(
          (q) => q.id === questionId && q.type === 'file',
        )
      ) {
        toCreate.push(
          this.fileRepo.create({
            fileName: file.filename,
            filePath: file.path,
            questionId,
            answerId,
          }),
        );
      }
    }

    if (toCreate.length) {
      await queryRunner.manager.save(toCreate);
    }

    for (const f of toUpdate) {
      await queryRunner.manager.update(
        FileUpload,
        { id: f.id },
        { filePath: f.filePath },
      );
    }

    deleteFilesByPaths(deletePaths);
  }
}
