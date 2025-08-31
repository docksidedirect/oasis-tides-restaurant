<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogPostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $blogPosts = [
            [
                'title' => 'The Art of Fresh Seafood: Our Daily Catch Philosophy',
                'slug' => 'art-of-fresh-seafood-daily-catch-philosophy',
                'summary' => 'Discover how Oasis Tides ensures the freshest seafood reaches your table every day through our partnerships with local fishermen and sustainable practices.',
                'content' => 'At Oasis Tides, we believe that exceptional seafood starts with exceptional sourcing. Every morning before dawn, our team works closely with local fishermen to select the finest catch of the day. Our commitment to freshness means that what you taste on your plate was swimming in the ocean just hours before.

We have built lasting relationships with sustainable fishing operations along our coast, ensuring that every piece of seafood we serve meets our strict quality standards while supporting responsible fishing practices. From the moment the fish is caught to when it arrives at your table, we maintain a cold chain that preserves the natural flavors and textures that make seafood so special.

Our chefs inspect every delivery personally, selecting only the best specimens for our menu. This dedication to quality means our menu changes daily based on what nature provides, ensuring you always experience seafood at its absolute peak.',
                'image' => 'fresh-seafood-blog.jpg',
                'published' => true,
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Sustainable Dining: Our Commitment to Ocean Conservation',
                'slug' => 'sustainable-dining-ocean-conservation-commitment',
                'summary' => 'Learn about Oasis Tides commitment to sustainable dining practices and how we are working to protect our oceans for future generations.',
                'content' => 'Sustainability is not just a buzzword at Oasis Tides – it is a core value that guides every decision we make. As a restaurant that depends on the bounty of the sea, we understand our responsibility to protect marine ecosystems for future generations.

We partner exclusively with fishermen who use sustainable fishing methods, avoiding overfished species and supporting local fishing communities. Our menu features seasonal selections that align with natural breeding cycles, ensuring we never contribute to the depletion of marine populations.

Beyond sourcing, we have implemented comprehensive waste reduction programs, use biodegradable packaging, and have eliminated single-use plastics from our operations. Our goal is to prove that exceptional dining and environmental responsibility can go hand in hand.',
                'image' => 'sustainable-dining-blog.jpg',
                'published' => true,
                'published_at' => now()->subDays(12),
            ],
            [
                'title' => 'Behind the Scenes: Meet Our Executive Chef',
                'slug' => 'behind-scenes-meet-executive-chef',
                'summary' => 'Get to know Chef Marina Rodriguez, whose passion for coastal cuisine and innovative techniques have made Oasis Tides a culinary destination.',
                'content' => 'Chef Marina Rodriguez brings over 15 years of culinary expertise to Oasis Tides, with a background that spans from Michelin-starred restaurants in Spain to coastal eateries in California. Her philosophy centers on letting the natural flavors of fresh seafood shine while incorporating innovative techniques that surprise and delight.

"I believe that the ocean provides us with the most perfect ingredients," says Chef Rodriguez. "My job is not to mask those flavors, but to enhance them and present them in ways that create memorable experiences for our guests."

Under her leadership, our kitchen has become known for dishes that balance tradition with creativity. From her signature seafood paella that takes three hours to prepare, to the delicate crudo preparations that highlight the purity of our daily catch, every dish reflects her commitment to excellence.',
                'image' => 'chef-marina-blog.jpg',
                'published' => true,
                'published_at' => now()->subDays(18),
            ],
            [
                'title' => 'Wine Pairing Guide: Perfect Matches for Seafood',
                'slug' => 'wine-pairing-guide-perfect-matches-seafood',
                'summary' => 'Discover the art of pairing wines with seafood dishes. Our sommelier shares expert tips for enhancing your dining experience.',
                'content' => 'Pairing wine with seafood is an art that can elevate your dining experience to new heights. Our sommelier, James Chen, has curated a selection of wines that complement the delicate flavors of our seafood dishes perfectly.

For lighter fish like sole or halibut, we recommend crisp white wines such as Sauvignon Blanc or Albariño. These wines provide acidity that enhances the fish without overwhelming its subtle flavors. For richer fish like salmon or tuna, consider a light red wine like Pinot Noir or a full-bodied white like Chardonnay.

Shellfish pairs beautifully with Champagne or other sparkling wines – the bubbles and acidity cut through the richness while complementing the briny sweetness. For our signature paella, we suggest a Spanish Tempranillo or Garnacha that can stand up to the complex flavors of saffron and mixed seafood.',
                'image' => 'wine-pairing-blog.jpg',
                'published' => true,
                'published_at' => now()->subDays(25),
            ],
            [
                'title' => 'Seasonal Menu Changes: What to Expect This Fall',
                'slug' => 'seasonal-menu-changes-what-expect-this-fall',
                'summary' => 'As the seasons change, so does our menu. Preview the exciting new dishes and seasonal ingredients coming to Oasis Tides this fall.',
                'content' => 'Fall brings exciting changes to the Oasis Tides menu as we embrace the seasonal bounty that this time of year provides. Cooler waters mean different fish species are at their peak, and we are thrilled to introduce several new dishes that celebrate autumn flavors.

Our new fall menu features wild striped bass with roasted root vegetables, pan-seared scallops with butternut squash puree, and a hearty seafood stew perfect for cooler evenings. We are also introducing seasonal cocktails that incorporate fall spices and local ingredients.

The changing seasons also mean we will be featuring different types of oysters from colder waters, each with unique flavor profiles that reflect their origin. Our raw bar will showcase these seasonal selections alongside our regular favorites.',
                'image' => 'fall-menu-blog.jpg',
                'published' => true,
                'published_at' => now()->subDays(3),
            ],
        ];

        foreach ($blogPosts as $post) {
            \App\Models\BlogPost::create($post);
        }
    }
}
