import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaCheckCircle, FaThumbsUp, FaReply } from 'react-icons/fa';

const ProductQA = ({ productId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // New Question form
  const [newQuestion, setNewQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productId) {
      fetchQuestions();
    }
  }, [productId]);

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get(`/qa/product/${productId}?sort=helpful`);
      setQuestions(data.data || []);
    } catch (error) {
      console.error('Error fetching Q&A:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (newQuestion.length < 10) {
      setError('Question must be at least 10 characters long.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/qa', {
        productId,
        question: newQuestion
      });
      setNewQuestion('');
      fetchQuestions(); // Refresh list (though usually requires approval in real apps, we show immediately for now)
      alert('Question submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (qaId, type) => {
    if (!user) {
      alert('Please login to vote.');
      return;
    }
    try {
      await api.post(`/qa/${qaId}/${type}`);
      fetchQuestions(); // Refresh to show new vote count
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading Q&A...</div>;

  return (
    <div className="glass-card" style={{ padding: 'var(--space-xl)', marginTop: 'var(--space-2xl)' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-lg)' }}>Customer Questions & Answers</h2>

      {/* Ask Question Form */}
      <div style={{ marginBottom: 'var(--space-2xl)', background: 'var(--bg-secondary)', padding: 'var(--space-lg)', borderRadius: 'var(--radius-md)' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: 'var(--space-sm)' }}>Have a question?</h3>
        <p style={{ marginBottom: 'var(--space-md)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Get answers from us and past customers.</p>

        {user ? (
          <form onSubmit={handleAskQuestion}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Type your question here..."
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !newQuestion.trim()}
              >
                {submitting ? 'Asking...' : 'Ask'}
              </button>
            </div>
            {error && <p style={{ color: 'var(--error)', marginTop: '8px', fontSize: '0.9rem' }}>{error}</p>}
          </form>
        ) : (
          <div style={{ padding: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-sm)' }}>
            <p>Please <a href={`/login?redirect=/product/${productId}`} style={{ color: 'var(--primary)', fontWeight: 'bold' }}>login</a> to ask a question.</p>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        {questions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No questions yet.</p>
        ) : (
          questions.map((qa) => (
            <div key={qa._id} style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <div style={{ marginTop: '5px' }}>
                <FaReply style={{ transform: 'rotate(180deg)', color: 'var(--text-muted)' }} />
              </div>
              <div style={{ flex: 1 }}>
                {/* Question */}
                <div style={{ marginBottom: 'var(--space-sm)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>
                    Q: {qa.question.text}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Asked by {qa.question.askedBy?.name} on {new Date(qa.question.askedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Answers */}
                {qa.status === 'answered' && qa.answer ? (
                  <div style={{ marginBottom: 'var(--space-md)', paddingLeft: 'var(--space-md)', borderLeft: '2px solid var(--success)' }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      A: {qa.answer.text}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      By {qa.answer.answeredBy?.storeName || 'Seller'} <FaCheckCircle size={12} color="var(--success)" title="Verified Seller" />
                      {' • '}{new Date(qa.answer.answeredAt).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <div style={{ paddingLeft: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Unanswered yet.
                  </div>
                )}

                {/* Helpful Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginTop: 'var(--space-sm)' }}>
                  <button
                    onClick={() => handleVote(qa._id, 'helpful')}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      color: qa.userHelpfulVotes?.includes(user?._id) ? 'var(--primary)' : 'var(--text-secondary)'
                    }}
                  >
                    <FaThumbsUp size={14} /> Helpful ({qa.helpful})
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductQA;
