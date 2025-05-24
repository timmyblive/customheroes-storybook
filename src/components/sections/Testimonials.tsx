import Card from '../ui/Card';

export default function Testimonials() {
  const testimonials = [
    {
      content: "My daughter absolutely loves her personalized book! She was so excited to see herself as the main character. We read it every night, and it's become her favorite story.",
      author: "Sarah K.",
      role: "Mother of 2",
      avatar: "/images/placeholder.txt"
    },
    {
      content: "As a grandparent living far away, I wanted to give something special. This personalized book featuring my grandson was the perfect gift. The quality is outstanding!",
      author: "Robert M.",
      role: "Grandfather",
      avatar: "/images/placeholder.txt"
    },
    {
      content: "The creation process was so easy, even on my phone! The story turned out amazing, and my twins were thrilled to see themselves having adventures together in the book.",
      author: "Jennifer T.",
      role: "Mother of twins",
      avatar: "/images/placeholder.txt"
    },
    {
      content: "I ordered books for my classroom with each student as the main character. The children were absolutely delighted, and it's encouraged reluctant readers to engage with books.",
      author: "Marcus J.",
      role: "Elementary teacher",
      avatar: "/images/placeholder.txt"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-paper-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-4 text-inkwell-black">
            What Our Customers Say
          </h2>
          <p className="text-charcoal text-lg max-w-3xl mx-auto">
            Join thousands of families creating magical reading experiences with CustomHereos.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} variant="testimonial" className="p-6">
              <div className="mb-6 flex-1">
                <p className="text-charcoal italic relative">
                  <span className="absolute -top-6 -left-2 text-6xl text-tale-purple opacity-10">"</span>
                  {testimonial.content}
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-story-blue flex items-center justify-center text-white">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <h4 className="font-montserrat font-semibold text-inkwell-black">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-charcoal">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
