<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MenuItem;

class DummyProductsSeeder extends Seeder
{
    public function run()
    {
        $products = json_decode(file_get_contents(database_path('seeders/dummy-products.json')), true);

        foreach ($products as $item) {
            MenuItem::updateOrCreate(
                ['name' => $item['name']], // Unique by name
                [
                    'price' => $item['price'],
                    'category' => $item['category'],
                    'description' => $item['description'],
                    'image_url' => $item['image_url'],
                ]
            );
        }
    }
}
