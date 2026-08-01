import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Michael R.',
    location: 'United Kingdom',
    rating: 5,
    text: 'Outstanding execution speed and customer support. The spreads are incredibly tight, especially on major pairs. Highly recommended for serious traders.',
    date: '2 weeks ago',
  },
  {
    name: 'Sarah L.',
    location: 'Australia',
    rating: 5,
    text: 'Been trading with Axi for 3 years. The platform is reliable, withdrawals are fast, and the educational resources helped me become a better trader.',
    date: '1 month ago',
  },
  {
    name: 'David K.',
    location: 'Germany',
    rating: 5,
    text: 'The MT5 integration is seamless. I love the Autochartist plugin and the PsyQuation analytics. Best broker I have used in my 10 years of trading.',
    date: '3 weeks ago',
  },
  {
    name: 'Aisha M.',
    location: 'UAE',
    rating: 5,
    text: 'Regulated by multiple authorities which gives me peace of mind. The Islamic account option is great and the support team is very responsive.',
    date: '1 week ago',
  },
]

export default function ReviewsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Traders Worldwide
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-gray-600">4.8 out of 5 based on 2,400+ reviews</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <Quote className="w-8 h-8 text-[#D31C2B]/20 mb-4" />
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{review.text}</p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{review.name}</div>
                  <div className="text-xs text-gray-500">{review.location}</div>
                </div>
                <div className="text-xs text-gray-400">{review.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
