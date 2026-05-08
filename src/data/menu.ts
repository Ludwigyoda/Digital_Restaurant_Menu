export type Item = {
  id: string;
  nameEn: string;
  nameZh: string;
  descEn?: string;
  descZh?: string;
  price: number | string;
  priceAlt?: { label: string; value: number }[];
  accent?: "terracotta" | "talavera" | "saffron" | "fuchsia-mx" | "cactus";
};

export type SubGroup = {
  id: string;
  nameEn: string;
  nameZh: string;
  items: Item[];
};

export type SubCategory = {
  id: string;
  nameEn: string;
  nameZh: string;
  items?: Item[];
  groups?: SubGroup[];
};

export type Category = {
  id: "drinks" | "food";
  nameEn: string;
  nameZh: string;
  subs: SubCategory[];
};

export const MENU: Category[] = [
  {
    id: "food",
    nameEn: "Food",
    nameZh: "美食",
    subs: [
      {
        id: "tacos",
        nameEn: "Tacos",
        nameZh: "塔可",
        items: [
          { id: "t1", nameEn: "Al Pastor", nameZh: "牧羊人塔可", descEn: "Marinated pork, pineapple, cilantro", descZh: "腌猪肉、菠萝、香菜", price: 38 },
          { id: "t2", nameEn: "Carne Asada", nameZh: "烤牛肉塔可", descEn: "Grilled beef, onion, lime", descZh: "烤牛肉、洋葱、青柠", price: 42 },
          { id: "t3", nameEn: "Pollo Tinga", nameZh: "辣味鸡塔可", descEn: "Chipotle chicken, crema", descZh: "墨西哥辣椒鸡、酸奶油", price: 38 },
          { id: "t4", nameEn: "Baja Fish", nameZh: "下加州鱼塔可", descEn: "Crispy fish, slaw, chipotle aioli", descZh: "脆炸鱼、卷心菜、辣椒蛋黄酱", price: 45 },
        ],
      },
      {
        id: "burrito",
        nameEn: "Burrito",
        nameZh: "卷饼",
        items: [
          { id: "b1", nameEn: "Carnitas Burrito", nameZh: "猪肉卷饼", descEn: "Slow pork, rice, beans, salsa", descZh: "慢炖猪肉、米饭、豆、莎莎", price: 68 },
          { id: "b2", nameEn: "Veggie Burrito", nameZh: "蔬菜卷饼", descEn: "Beans, rice, guac, peppers", descZh: "豆、米饭、牛油果酱、辣椒", price: 58 },
          { id: "b3", nameEn: "Chicken Burrito", nameZh: "鸡肉卷饼", descEn: "Grilled chicken, cheese, salsa verde", descZh: "烤鸡、芝士、绿莎莎", price: 65 },
        ],
      },
      {
        id: "ceviche",
        nameEn: "Ceviche",
        nameZh: "酸橘汁腌鱼",
        items: [
          { id: "c1", nameEn: "Ceviche Clásico", nameZh: "经典酸橘鱼", descEn: "Sea bass, lime, red onion, cilantro", descZh: "鲈鱼、青柠、红洋葱、香菜", price: 72 },
          { id: "c2", nameEn: "Ceviche Verde", nameZh: "绿色酸橘鱼", descEn: "Shrimp, avocado, tomatillo", descZh: "虾、牛油果、绿番茄", price: 78 },
        ],
      },
      {
        id: "to-share",
        nameEn: "To Share",
        nameZh: "分享小食",
        items: [
          { id: "ts1", nameEn: "Guacamole & Totopos", nameZh: "牛油果酱配玉米片", descEn: "Fresh guac, lime, house chips", descZh: "新鲜牛油果酱、青柠、自制薯片", price: 58 },
          { id: "ts2", nameEn: "Nachos Supremos", nameZh: "至尊纳乔", descEn: "Cheese, beans, jalapeño, crema", descZh: "芝士、豆、辣椒、酸奶油", price: 68 },
          { id: "ts3", nameEn: "Quesadilla", nameZh: "墨西哥薄饼", descEn: "Cheese, mushroom or chicken", descZh: "芝士、蘑菇或鸡肉", price: 52 },
          { id: "ts4", nameEn: "Elote", nameZh: "墨西哥烤玉米", descEn: "Grilled corn, cotija, chili", descZh: "烤玉米、白芝士、辣椒", price: 32 },
        ],
      },
    ],
  },
  {
    id: "drinks",
    nameEn: "Drinks",
    nameZh: "酒水",
    subs: [
      {
        id: "cocktails",
        nameEn: "Cocktails",
        nameZh: "鸡尾酒",
        groups: [
          {
            id: "all-star",
            nameEn: "All Star",
            nameZh: "明星鸡尾酒",
            items: [
              { id: "as1", nameEn: "Spicy Margarita", nameZh: "辣味玛格丽特", descEn: "Tequila, lime, agave, chili salt", descZh: "龙舌兰、青柠、龙舌兰糖浆、辣椒盐", price: 90, accent: "terracotta" },
              { id: "as2", nameEn: "Mezcal Old Fashioned", nameZh: "梅斯卡尔古典", descEn: "Mezcal, agave, orange bitters", descZh: "梅斯卡尔、龙舌兰糖浆、橙苦精", price: 95, accent: "terracotta" },
              { id: "as3", nameEn: "Paloma Picante", nameZh: "辣味帕洛玛", descEn: "Tequila, grapefruit, lime, jalapeño", descZh: "龙舌兰、西柚、青柠、墨西哥辣椒", price: 88, accent: "terracotta" },
              { id: "as4", nameEn: "Tommy's Margarita", nameZh: "汤米玛格丽特", descEn: "Tequila, lime, agave nectar", descZh: "龙舌兰、青柠、龙舌兰花蜜", price: 85, accent: "terracotta" },
            ],
          },
          {
            id: "signature",
            nameEn: "Signature",
            nameZh: "招牌鸡尾酒",
            items: [
              { id: "sg1", nameEn: "Mr Red", nameZh: "红先生", descEn: "Hibiscus, mezcal, lime, ginger", descZh: "洛神花、梅斯卡尔、青柠、姜", price: 98, accent: "terracotta" },
              { id: "sg2", nameEn: "Mr White", nameZh: "白先生", descEn: "Coconut, gin, cucumber, yuzu", descZh: "椰子、金酒、黄瓜、柚子", price: 98, accent: "talavera" },
              { id: "sg3", nameEn: "Mr Yellow", nameZh: "黄先生", descEn: "Pineapple, mezcal, turmeric, lime", descZh: "菠萝、梅斯卡尔、姜黄、青柠", price: 98, accent: "saffron" },
              { id: "sg4", nameEn: "Mrs Pink", nameZh: "粉夫人", descEn: "Rose, gin, raspberry, prosecco", descZh: "玫瑰、金酒、覆盆子、普罗赛克", price: 98, accent: "fuchsia-mx" },
              { id: "sg5", nameEn: "Mrs Green", nameZh: "绿夫人", descEn: "Cilantro, mezcal, cucumber, lime", descZh: "香菜、梅斯卡尔、黄瓜、青柠", price: 98, accent: "cactus" },
              { id: "sg6", nameEn: "Go to GranCanaria", nameZh: "度假就去 GranCanaria", descEn: "Rum, passion fruit, vanilla, lime", descZh: "朗姆、百香果、香草、青柠", price: 68, accent: "saffron" },
              { id: "sg7", nameEn: "Out Hi Wave", nameZh: "海浪奇遇", descEn: "Vodka, blue curaçao, citrus, tonic", descZh: "伏特加、蓝橙、柑橘、汤力", price: 78, accent: "talavera" },
            ],
          },
          {
            id: "classic",
            nameEn: "Classic",
            nameZh: "经典鸡尾酒",
            items: [
              { id: "cl1", nameEn: "Negroni", nameZh: "尼格罗尼", price: 80 },
              { id: "cl2", nameEn: "Old Fashioned", nameZh: "古典", price: 80 },
              { id: "cl3", nameEn: "Manhattan", nameZh: "曼哈顿", price: 80 },
              { id: "cl4", nameEn: "Whiskey Sour", nameZh: "威士忌酸", price: 80 },
              { id: "cl5", nameEn: "Daiquiri", nameZh: "代基里", price: 80 },
              { id: "cl6", nameEn: "Mojito", nameZh: "莫吉托", price: 80 },
              { id: "cl7", nameEn: "Aperol Spritz", nameZh: "阿佩罗气泡", price: 80 },
              { id: "cl8", nameEn: "Espresso Martini", nameZh: "浓缩咖啡马天尼", price: 80 },
              { id: "cl9", nameEn: "Cosmopolitan", nameZh: "大都会", price: 80 },
              { id: "cl10", nameEn: "Gimlet", nameZh: "吉姆雷特", price: 80 },
              { id: "cl11", nameEn: "Boulevardier", nameZh: "花花公子", price: 80 },
              { id: "cl12", nameEn: "Sidecar", nameZh: "边车", price: 80 },
              { id: "cl13", nameEn: "Mai Tai", nameZh: "迈泰", price: 80 },
              { id: "cl14", nameEn: "Penicillin", nameZh: "盘尼西林", price: 80 },
              { id: "cl15", nameEn: "French 75", nameZh: "法兰西 75", price: 80 },
            ],
          },
          {
            id: "mocktail",
            nameEn: "Mocktail",
            nameZh: "无酒精饮品",
            items: [
              { id: "mo1", nameEn: "Virgin Mojito", nameZh: "无酒精莫吉托", descEn: "Mint, lime, soda", descZh: "薄荷、青柠、苏打", price: 50 },
              { id: "mo2", nameEn: "Passion Sunset", nameZh: "百香日落", descEn: "Passion, orange, grenadine", descZh: "百香果、橙、石榴糖浆", price: 55 },
              { id: "mo3", nameEn: "Cucumber Cooler", nameZh: "黄瓜清饮", descEn: "Cucumber, lime, tonic", descZh: "黄瓜、青柠、汤力", price: 50 },
            ],
          },
        ],
      },
      {
        id: "wine",
        nameEn: "Wine",
        nameZh: "葡萄酒",
        items: [
          { id: "w1", nameEn: "House Red — Glass", nameZh: "招牌红 / 杯", price: 60 },
          { id: "w2", nameEn: "House White — Glass", nameZh: "招牌白 / 杯", price: 60 },
          { id: "w3", nameEn: "Rosé — Glass", nameZh: "桃红 / 杯", price: 65 },
          { id: "w4", nameEn: "Malbec — Bottle", nameZh: "马尔贝克 / 瓶", price: 320 },
          { id: "w5", nameEn: "Chardonnay — Bottle", nameZh: "霞多丽 / 瓶", price: 300 },
        ],
      },
      {
        id: "champagne",
        nameEn: "Champagne",
        nameZh: "香槟",
        items: [
          { id: "ch1", nameEn: "Brut — Glass", nameZh: "干型 / 杯", price: 90 },
          { id: "ch2", nameEn: "Brut — Bottle", nameZh: "干型 / 瓶", price: 680 },
          { id: "ch3", nameEn: "Rosé — Bottle", nameZh: "桃红 / 瓶", price: 780 },
        ],
      },
      {
        id: "beer",
        nameEn: "Beer",
        nameZh: "啤酒",
        items: [
          { id: "be1", nameEn: "Corona", nameZh: "科罗娜", price: 45 },
          { id: "be2", nameEn: "Modelo", nameZh: "莫德罗", price: 45 },
          { id: "be3", nameEn: "Pacifico", nameZh: "太平洋", price: 45 },
          { id: "be4", nameEn: "Local IPA", nameZh: "本地 IPA", price: 50 },
        ],
      },
      {
        id: "shots",
        nameEn: "Shots",
        nameZh: "烈酒",
        items: [
          { id: "sh1", nameEn: "Tequila Blanco", nameZh: "白龙舌兰", price: 40, priceAlt: [{ label: "×1", value: 40 }, { label: "×12", value: 420 }], accent: "fuchsia-mx" },
          { id: "sh2", nameEn: "Tequila Reposado", nameZh: "微陈龙舌兰", price: 50, priceAlt: [{ label: "×1", value: 50 }, { label: "×12", value: 540 }], accent: "fuchsia-mx" },
          { id: "sh3", nameEn: "Mezcal Joven", nameZh: "梅斯卡尔", price: 55, priceAlt: [{ label: "×1", value: 55 }, { label: "×12", value: 600 }], accent: "fuchsia-mx" },
          { id: "sh4", nameEn: "Jägermeister", nameZh: "野格", price: 45, priceAlt: [{ label: "×1", value: 45 }, { label: "×12", value: 480 }], accent: "fuchsia-mx" },
        ],
      },
    ],
  },
];
