import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const CreateChecklist = () => {
    const { orderId } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { questionText: '', type: 'text', options: [], required: false }
        ]);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/checklists', {
                orderId,
                name,
                description,
                questions
            });
            navigate('/orders');
        } catch (err) {
            console.error('Failed to create checklist', err);
            alert('Failed to create checklist');
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Checklist</h2>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Checklist Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows="2"
                    ></textarea>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Questions</h3>
                    {questions.map((q, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium">Question {index + 1}</span>
                                <button type="button" onClick={() => removeQuestion(index)} className="text-red-500 text-sm">Remove</button>
                            </div>
                            <Input
                                label="Question Text"
                                value={q.questionText}
                                onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={q.type}
                                        onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="text">Text</option>
                                        <option value="radio">Radio</option>
                                        <option value="checkbox">Checkbox</option>
                                        <option value="dropdown">Dropdown</option>
                                    </select>
                                </div>
                                <div className="flex items-center mt-6">
                                    <input
                                        type="checkbox"
                                        checked={q.required}
                                        onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                                        className="mr-2"
                                    />
                                    <label className="text-sm text-gray-700">Required</label>
                                </div>
                            </div>
                            {['radio', 'checkbox', 'dropdown'].includes(q.type) && (
                                <Input
                                    label="Options (comma separated)"
                                    value={q.options ? q.options.join(',') : ''}
                                    onChange={(e) => updateQuestion(index, 'options', e.target.value.split(','))}
                                    placeholder="Option 1, Option 2"
                                />
                            )}
                        </div>
                    ))}
                    <Button onClick={addQuestion} variant="secondary" className="w-full">Add Question</Button>
                </div>

                <Button type="submit" className="w-full">Save Checklist</Button>
            </form>
        </div>
    );
};

export default CreateChecklist;
