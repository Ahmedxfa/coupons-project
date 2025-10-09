import { PrismaClient, DealType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.favoriteDeal.deleteMany();
  await prisma.favoriteStore.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.store.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Fashion & Apparel',
        slug: 'fashion-apparel',
        icon: '👕',
        featured: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
        icon: '💻',
        featured: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Garden',
        slug: 'home-garden',
        icon: '🏠',
        featured: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beauty & Health',
        slug: 'beauty-health',
        icon: '💄',
        featured: false,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Food & Grocery',
        slug: 'food-grocery',
        icon: '🍔',
        featured: false,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        icon: '⚽',
        featured: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Travel & Hotels',
        slug: 'travel-hotels',
        icon: '✈️',
        featured: false,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Entertainment',
        slug: 'entertainment',
        icon: '🎮',
        featured: false,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create Stores
  const fashionStores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'Nike',
        slug: 'nike',
        logoUrl: 'https://logo.clearbit.com/nike.com',
        description: 'Just Do It. Find athletic shoes, clothing and gear for the whole family.',
        websiteUrl: 'https://www.nike.com',
        categoryId: categories[0].id,
        featured: true,
        domains: ['nike.com', 'www.nike.com'],
        extensionEnabled: true,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Adidas',
        slug: 'adidas',
        logoUrl: 'https://logo.clearbit.com/adidas.com',
        description: 'Impossible is Nothing. Shop for shoes, clothing and accessories.',
        websiteUrl: 'https://www.adidas.com',
        categoryId: categories[0].id,
        featured: true,
        domains: ['adidas.com', 'www.adidas.com'],
        extensionEnabled: true,
      },
    }),
    prisma.store.create({
      data: {
        name: 'H&M',
        slug: 'hm',
        logoUrl: 'https://logo.clearbit.com/hm.com',
        description: 'Fashion and quality at the best price in a sustainable way.',
        websiteUrl: 'https://www.hm.com',
        categoryId: categories[0].id,
        featured: false,
        domains: ['hm.com', 'www.hm.com'],
        extensionEnabled: false,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Zara',
        slug: 'zara',
        logoUrl: 'https://logo.clearbit.com/zara.com',
        description: 'Latest trends in fashion for women, men and kids.',
        websiteUrl: 'https://www.zara.com',
        categoryId: categories[0].id,
        featured: false,
        domains: ['zara.com', 'www.zara.com'],
        extensionEnabled: false,
      },
    }),
  ]);

  const electronicsStores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'Best Buy',
        slug: 'best-buy',
        logoUrl: 'https://logo.clearbit.com/bestbuy.com',
        description: 'Shop electronics, computers, appliances, cell phones, video games & more.',
        websiteUrl: 'https://www.bestbuy.com',
        categoryId: categories[1].id,
        featured: true,
        domains: ['bestbuy.com', 'www.bestbuy.com'],
        extensionEnabled: true,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Amazon',
        slug: 'amazon',
        logoUrl: 'https://logo.clearbit.com/amazon.com',
        description: 'Online shopping from a great selection of electronics, books, and more.',
        websiteUrl: 'https://www.amazon.com',
        categoryId: categories[1].id,
        featured: true,
        domains: ['amazon.com', 'www.amazon.com'],
        extensionEnabled: true,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Newegg',
        slug: 'newegg',
        logoUrl: 'https://logo.clearbit.com/newegg.com',
        description: 'Buy computer parts, laptops, electronics and more online.',
        websiteUrl: 'https://www.newegg.com',
        categoryId: categories[1].id,
        featured: false,
        domains: ['newegg.com', 'www.newegg.com'],
        extensionEnabled: false,
      },
    }),
  ]);

  const homeStores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'IKEA',
        slug: 'ikea',
        logoUrl: 'https://logo.clearbit.com/ikea.com',
        description: 'Affordable furniture and home furnishing inspiration for all sizes of wallets.',
        websiteUrl: 'https://www.ikea.com',
        categoryId: categories[2].id,
        featured: true,
        domains: ['ikea.com', 'www.ikea.com'],
        extensionEnabled: false,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Wayfair',
        slug: 'wayfair',
        logoUrl: 'https://logo.clearbit.com/wayfair.com',
        description: 'Shop furniture, home decor, cookware & more.',
        websiteUrl: 'https://www.wayfair.com',
        categoryId: categories[2].id,
        featured: false,
        domains: ['wayfair.com', 'www.wayfair.com'],
        extensionEnabled: true,
      },
    }),
  ]);

  const beautyStores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'Sephora',
        slug: 'sephora',
        logoUrl: 'https://logo.clearbit.com/sephora.com',
        description: 'Beauty products, makeup, skincare, fragrance & more.',
        websiteUrl: 'https://www.sephora.com',
        categoryId: categories[3].id,
        featured: true,
        domains: ['sephora.com', 'www.sephora.com'],
        extensionEnabled: false,
      },
    }),
    prisma.store.create({
      data: {
        name: 'Ulta Beauty',
        slug: 'ulta',
        logoUrl: 'https://logo.clearbit.com/ulta.com',
        description: 'Shop makeup, skincare, haircare and fragrance.',
        websiteUrl: 'https://www.ulta.com',
        categoryId: categories[3].id,
        featured: false,
        domains: ['ulta.com', 'www.ulta.com'],
        extensionEnabled: false,
      },
    }),
  ]);

  const sportsStores = await Promise.all([
    prisma.store.create({
      data: {
        name: 'Dick\'s Sporting Goods',
        slug: 'dicks-sporting-goods',
        logoUrl: 'https://logo.clearbit.com/dickssportinggoods.com',
        description: 'Shop a wide selection of sports gear, equipment, apparel and footwear.',
        websiteUrl: 'https://www.dickssportinggoods.com',
        categoryId: categories[5].id,
        featured: false,
        domains: ['dickssportinggoods.com', 'www.dickssportinggoods.com'],
        extensionEnabled: false,
      },
    }),
  ]);

  const allStores = [
    ...fashionStores,
    ...electronicsStores,
    ...homeStores,
    ...beautyStores,
    ...sportsStores,
  ];

  console.log(`✅ Created ${allStores.length} stores`);

  // Create Deals
  const dealsData = [
    // Nike deals
    {
      storeId: fashionStores[0].id,
      title: '20% Off Sitewide',
      description: 'Get 20% off your entire purchase. Valid on sale items too!',
      code: 'NIKE20',
      type: DealType.PERCENTAGE,
      discountPercentage: 20,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      featured: true,
      autoApplicable: true,
      extensionPriority: 1,
    },
    {
      storeId: fashionStores[0].id,
      title: 'Free Shipping on Orders Over $50',
      description: 'No code needed. Free standard shipping automatically applied.',
      type: DealType.FREE_SHIPPING,
      expirationDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      featured: false,
    },
    {
      storeId: fashionStores[0].id,
      title: '$25 Off Orders $100+',
      description: 'Save $25 when you spend $100 or more.',
      code: 'SAVE25',
      type: DealType.FIXED_AMOUNT,
      discountAmount: 25,
      expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      featured: false,
    },
    // Adidas deals
    {
      storeId: fashionStores[1].id,
      title: '30% Off Summer Collection',
      description: 'Summer sale! Get 30% off selected items.',
      code: 'SUMMER30',
      type: DealType.PERCENTAGE,
      discountPercentage: 30,
      expirationDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      featured: true,
      autoApplicable: true,
      extensionPriority: 1,
    },
    {
      storeId: fashionStores[1].id,
      title: 'Buy One Get One 50% Off',
      description: 'Buy any item and get second item at 50% off.',
      code: 'BOGO50',
      type: DealType.BOGO,
      expirationDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      featured: false,
    },
    // Best Buy deals
    {
      storeId: electronicsStores[0].id,
      title: '$100 Off Laptops Over $799',
      description: 'Save big on laptops. Minimum purchase $799.',
      code: 'LAPTOP100',
      type: DealType.FIXED_AMOUNT,
      discountAmount: 100,
      expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      featured: true,
      autoApplicable: true,
      extensionPriority: 1,
    },
    {
      storeId: electronicsStores[0].id,
      title: '15% Off TVs and Home Theater',
      description: 'Upgrade your entertainment system and save.',
      code: 'TV15',
      type: DealType.PERCENTAGE,
      discountPercentage: 15,
      expirationDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      featured: false,
    },
    // Amazon deals
    {
      storeId: electronicsStores[1].id,
      title: 'Prime Members: Extra 20% Off',
      description: 'Exclusive deal for Prime members on electronics.',
      code: 'PRIME20',
      type: DealType.PERCENTAGE,
      discountPercentage: 20,
      expirationDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      featured: true,
    },
    {
      storeId: electronicsStores[1].id,
      title: 'Lightning Deal: $30 Off $150+',
      description: 'Limited time offer. Hurry while stocks last!',
      code: 'LIGHTNING30',
      type: DealType.FIXED_AMOUNT,
      discountAmount: 30,
      expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days - expiring soon
      featured: true,
    },
    // IKEA deals
    {
      storeId: homeStores[0].id,
      title: '25% Off Kitchen Furniture',
      description: 'Redesign your kitchen with our amazing deals.',
      code: 'KITCHEN25',
      type: DealType.PERCENTAGE,
      discountPercentage: 25,
      expirationDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      featured: false,
    },
    {
      storeId: homeStores[0].id,
      title: 'Free Delivery on Orders Over $299',
      description: 'Get free home delivery on large orders.',
      type: DealType.FREE_SHIPPING,
      expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      featured: false,
    },
    // Sephora deals
    {
      storeId: beautyStores[0].id,
      title: '20% Off First Purchase',
      description: 'New customers get 20% off their first order.',
      code: 'WELCOME20',
      type: DealType.PERCENTAGE,
      discountPercentage: 20,
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      featured: true,
    },
    {
      storeId: beautyStores[0].id,
      title: 'Free Samples with Every Order',
      description: 'Choose 3 free samples at checkout.',
      type: DealType.OTHER,
      expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      featured: false,
    },
    // Expired deal example
    {
      storeId: fashionStores[2].id,
      title: 'Black Friday: 50% Off Everything',
      description: 'This deal has expired.',
      code: 'EXPIRED50',
      type: DealType.PERCENTAGE,
      discountPercentage: 50,
      expirationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      isExpired: true,
      featured: false,
    },
  ];

  const deals = await Promise.all(
    dealsData.map((deal) => prisma.deal.create({ data: deal }))
  );

  console.log(`✅ Created ${deals.length} deals`);

  // Create demo users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'demo@example.com',
        name: 'Demo User',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john@example.com',
        name: 'John Doe',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} demo users`);

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });