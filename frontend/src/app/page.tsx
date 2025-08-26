export default function HomePage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-ocean-50 py-16 rounded-b-3xl shadow-md text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-ocean-400 to-primary-500 rounded-full flex items-center justify-center mb-6 animate-bounce-gentle">
            <span className="text-white text-5xl">🌊</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-ocean-900 font-display mb-3">
            Oasis Tides
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A Fine Dining Seafood Experience by the Sea
          </p>
          <a
            href="/menu"
            className="inline-block bg-ocean-600 text-white px-8 py-3 rounded-lg shadow hover:bg-ocean-700 font-semibold transition-all text-lg"
          >
            Explore Our Menu
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <Feature
          icon={<span className="text-5xl">🦞</span>}
          title="Fresh Seafood"
          desc="Catch of the day, direct from local waters, every day."
        />
        <Feature
          icon={<span className="text-5xl">🍷</span>}
          title="Fine Ambience"
          desc="Stunning ocean views & a world-class wine selection."
        />
        <Feature
          icon={<span className="text-5xl">🎶</span>}
          title="Live Music"
          desc="Enjoy jazz & acoustic performances every weekend."
        />
      </section>

      {/* Menu Preview Section */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-7 text-ocean-800">
          Today Specials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <MenuCard name="Grilled Salmon" price={28.99} image="🐟" />
          <MenuCard name="Lobster Tail" price={48.99} image="🦞" />
          <MenuCard name="Seared Tuna" price={26.99} image="🍣" />
        </div>
        <a
          href="/menu"
          className="block text-ocean-700 hover:text-ocean-500 mt-8 text-center"
        >
          View Full Menu →
        </a>
      </section>

      {/* Reservation CTA */}
      <section className="bg-primary-600 py-14 mt-12 mb-8 text-center text-white rounded-2xl shadow animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
          Reserve Your Table Now
        </h2>
        <p className="mb-6 font-body text-primary-50 text-lg">
          Book ahead for the best oceanfront dining experience—tables fill up
          fast!
        </p>
        <a
          href="/reservation"
          className="inline-block bg-ocean-900 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-ocean-700 transition-colors"
        >
          Book a Reservation
        </a>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-ocean-800 text-center">
          What Our Guests Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Testimonial
            name="Samantha T."
            text="Everything was perfect—the seafood was so fresh and the staff were incredibly attentive. We'll be back!"
            rating={5}
          />
          <Testimonial
            name="Alex R."
            text="Gorgeous ocean view and the best grilled salmon I’ve ever tasted. Highly recommend Oasis Tides!"
            rating={4}
          />
        </div>
      </section>
    </main>
  );
}

// Feature Card component
function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white shadow rounded-2xl p-7 flex flex-col items-center text-center hover:shadow-lg transition-shadow animate-fade-in">
      <div className="mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-ocean-900 mb-1">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}

// Simple Menu Card component
function MenuCard({
  name,
  price,
  image,
}: {
  name: string;
  price: number;
  image: string;
}) {
  return (
    <div className="bg-sand-50 rounded-xl p-5 shadow flex flex-col items-center animate-fade-in border border-sand-100">
      <div className="text-5xl mb-2">{image}</div>
      <div className="font-bold text-ocean-800 text-lg mb-1">{name}</div>
      <div className="text-primary-700 font-bold mb-3">${price.toFixed(2)}</div>
      <button className="bg-primary-600 text-white py-1.5 px-5 rounded hover:bg-primary-700 transition text-sm font-medium">
        Order Now
      </button>
    </div>
  );
}

// Testimonial component
function Testimonial({
  name,
  text,
  rating,
}: {
  name: string;
  text: string;
  rating: number;
}) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 animate-slide-up border border-gray-100">
      <div className="font-bold text-primary-700 mb-2">{name}</div>
      <p className="text-gray-700 mb-4">“{text}”</p>
      <div className="flex items-center space-x-1">
        {Array.from({ length: rating }, (_, i) => (
          <span key={i} className="text-yellow-400 text-lg">
            ★
          </span>
        ))}
        {Array.from({ length: 5 - rating }, (_, i) => (
          <span key={i} className="text-gray-300 text-lg">
            ★
          </span>
        ))}
      </div>
    </div>
  );
}
