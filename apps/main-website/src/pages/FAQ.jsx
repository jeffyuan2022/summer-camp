import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "Do I need to speak Mandarin?",
      answer: "Absolutely not! The primary goal of the camp is for the students to experience American culture and practice their English in an immersive environment. Your everyday English is exactly what they need."
    },
    {
      question: "Can I host more than one student?",
      answer: "Yes, you can host up to two students. If hosting two students of the same gender, they are allowed to share a Queen or King-sized bed. You will receive the $560 compensation per student."
    },
    {
      question: "What happens during the day while I work?",
      answer: "The students will be engaged in camp activities at Grace Christian School or on scheduled excursions during the day. You only need to provide morning drop-off and evening pick-up."
    },
    {
      question: "When will I receive the $560 compensation?",
      answer: "Compensation details will be finalized during the placement process, but stipends are strictly provided to cover the costs of housing, meals, and transportation during the July 4th - July 12th period."
    },
    {
      question: "Do I need to take them sightseeing?",
      answer: "The camp handles major excursions and daily activities. However, you are highly encouraged to show them your favorite local spots, parks, or community activities during the evenings or any free days!"
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--blue-900)', marginBottom: '1rem' }}>Frequently Asked Questions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>
            Everything you need to know about becoming an AGI Host Family.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: 'var(--radius-lg)', 
              boxShadow: 'var(--shadow-sm)',
              borderBottom: '2px solid var(--blue-50)'
            }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--blue-800)', marginBottom: '1rem', fontWeight: 600 }}>{faq.question}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
