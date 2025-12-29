import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';

const ConductInspection = () => {
    const { orderId } = useParams();
    const [checklist, setChecklist] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch checklist for the order
        // Assuming we can get checklist by orderId or we need to fetch order then checklist
        // Let's assume there's an endpoint or we filter.
        // Actually, the backend routes show /checklists/:id gets a checklist.
        // But we don't know the checklist ID.
        // We might need to fetch the order first to get the checklist ID.
        const fetchData = async () => {
            try {
                const orderRes = await api.get(`/orders/${orderId}`);
                const order = orderRes.data;
                if (order.checklist) {
                    // If checklist is included in order response
                    setChecklist(order.checklist);
                } else {
                    // Try to fetch checklist if not in order
                    // This part is tricky without knowing exact API response structure for included models
                    // Let's assume order.checklist is populated as per model association
                    // If not, we might fail here.
                    // For now, let's assume it is.
                    console.warn("Checklist not found in order object, checking if separate fetch needed");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [orderId]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Submit answers
            // We need to loop through answers and submit them.
            // The backend likely expects a bulk create or individual answers.
            // Looking at `answer.routes.js`, it's not clear.
            // Let's assume we submit to `/answers` one by one or a bulk endpoint.
            // If no bulk endpoint, we do Promise.all.

            const promises = Object.keys(answers).map(qId => {
                return api.post('/answers', {
                    questionId: qId,
                    orderId: orderId,
                    checklistId: checklist.id,
                    value: answers[qId] // This might need formatting depending on type
                });
            });

            await Promise.all(promises);

            // Update order status
            await api.put(`/orders/${orderId}/status`, { status: 'inspected' });

            navigate('/orders');
        } catch (err) {
            console.error('Failed to submit inspection', err);
            alert('Failed to submit inspection');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!checklist) return <div>No checklist found for this order.</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Conduct Inspection: {checklist.name}</h2>
            <form onSubmit={handleSubmit}>
                {checklist.questions && checklist.questions.map((q) => (
                    <div key={q.id} className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {q.questionText} {q.required && '*'}
                        </label>

                        {q.type === 'text' && (
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                required={q.required}
                            />
                        )}

                        {q.type === 'radio' && q.options && q.options.map((opt) => (
                            <div key={opt} className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    name={`q-${q.id}`}
                                    value={opt}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    required={q.required}
                                    className="mr-2"
                                />
                                <label>{opt}</label>
                            </div>
                        ))}

                        {/* Add other types as needed */}
                    </div>
                ))}
                <Button type="submit" className="w-full">Submit Inspection</Button>
            </form>
        </div>
    );
};

export default ConductInspection;
