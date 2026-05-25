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
  defaultAccent?: NonNullable<Item["accent"]>;
  items?: Item[];
  groups?: SubGroup[];
};

export type Category = {
  id: "drinks" | "food";
  nameEn: string;
  nameZh: string;
  displayEn?: string;
  subEn?: string;
  subs: SubCategory[];
};

export const MENU: Category[] = [
  {
    id: "food",
    nameEn: "Food",
    nameZh: "美食",
    displayEn: "La Lupita",
    subEn: "Food",
    subs: [
      {
        id: "finger-food",
        nameEn: "Finger Food",
        nameZh: "分享小食",
        defaultAccent: "saffron",
        groups: [
          {
            id: "bar-snacks",
            nameEn: "Bar Snacks",
            nameZh: "酒吧小吃",
            items: [
              { id: "bs-peanuts", nameEn: "Peanuts", nameZh: "油炸花生米", descEn: "Crispy fried peanuts with salt", descZh: "香脆花生和盐", price: 28 },
              { id: "bs-cucumber", nameEn: "Soy Wasabi Cucumber", nameZh: "芥末酱油黄瓜条", descEn: "Fresh cucumber strips with soy sauce and wasabi", descZh: "鲜切黄瓜条配酱油和芥末", price: 38 },
            ],
          },
          {
            id: "appetizers",
            nameEn: "Appetizers",
            nameZh: "开胃菜",
            items: [
              { id: "app-fries", nameEn: "French Fries", nameZh: "炸薯条", descEn: "Crispy golden fries served with ketchup", descZh: "香脆金黄炸薯条配番茄酱", price: 38 },
              { id: "app-calamari", nameEn: "Salt & Pepper Calamari", nameZh: "椒盐鱿鱼圈", descEn: "Fried squid with garlic, served with spicy lime dip", descZh: "大蒜炒鱿鱼、配上辣椒青柠蘸酱", price: 68 },
              { id: "app-guac", nameEn: "Guacamole & Chips", nameZh: "牛油果酱&玉米片", descEn: "Fresh guacamole with grilled corn and corn chips", descZh: "搭配烤玉米粒和玉米片的牛油果酱", price: 68 },
              { id: "app-wings", nameEn: "Chicken Wings", nameZh: "鸡翅", descEn: "Buffalo-style wings (6 pcs)", descZh: "水牛城鸡翅（6块）", price: 58 },
              { id: "app-spring", nameEn: "Chicken Spring Rolls", nameZh: "鸡肉春卷", descEn: "Ground chicken, Thai basil and chili in a crispy roll, with lime dip", descZh: "鸡肉、泰国罗勒与辣椒脆皮卷、配辣味青柠蘸酱", price: 48 },
              { id: "app-nachos", nameEn: "Classic Nachos", nameZh: "经典烧烤玉米片", descEn: "Nachos with beans, cheese, tomato, onion, jalapeños. Add: vegetarian / chicken pastor / beef (+20RMB)", descZh: "烤玉米片配豆子、奶酪、番茄、洋葱、墨西哥辣椒。素食/鸡肉/牛肉再加20元", price: 58 },
            ],
          },
          {
            id: "ceviches",
            nameEn: "Ceviches",
            nameZh: "酸橘汁腌海鲜",
            items: [
              { id: "cv-prawn", nameEn: "Tropical Prawn Ceviche", nameZh: "热带风味腌虾", descEn: "Shrimps in coconut lime dressing with pineapple, cucumber and chili", descZh: "椰香青柠汁腌虾、搭配菠萝和小米椒、黄瓜", price: 78 },
              { id: "cv-lupita", nameEn: "Lupita Cocktail Ceviche", nameZh: "拉鲁皮塔墨西哥酒腌海鲜", descEn: "Shrimps, fish, tomato juice, onion, coriander, jalapeño, spicy sauce", descZh: "鱼类及虾、番茄汁、洋葱、辣椒、辣酱", price: 88 },
              { id: "cv-fish", nameEn: "Tropical Fish Ceviche", nameZh: "热带风味腌鱼", descEn: "Fish cured in coconut lime with pineapple, cucumber and chili", descZh: "椰香青柠汁腌鱼、搭配菠萝和小米椒、黄瓜", price: 78 },
            ],
          },
        ],
      },
      {
        id: "platos",
        nameEn: "Platos",
        nameZh: "主菜",
        defaultAccent: "terracotta",
        groups: [
          {
            id: "quesadillas",
            nameEn: "Quesadillas",
            nameZh: "墨西哥煎饼",
            items: [
              { id: "qa-beef", nameEn: "Quesadilla Asada Beef", nameZh: "烤牛肉煎饼", descEn: "Grilled beef, cheese, lettuce, onion, coriander", descZh: "烤牛肉、奶酪、生菜、洋葱、香菜", price: 78 },
              { id: "qa-pastor", nameEn: "Chicken Pastor Quesadilla", nameZh: "墨西哥帕多斯烤鸡肉煎饼", descEn: "Spiced chicken, cheese, pineapple, lettuce, onions, coriander", descZh: "香料鸡肉菠萝、生菜洋葱、香菜", price: 75 },
              { id: "qa-tinga", nameEn: "Quesadilla de Tinga", nameZh: "墨西哥辣鸡肉煎饼", descEn: "Shredded chicken in smoky chipotle sauce", descZh: "烟熏辣椒酱鸡肉丝", price: 75 },
              { id: "qa-shrimp", nameEn: "Baja Shrimp Quesadilla", nameZh: "炸虾煎饼", descEn: "Crispy shrimp with cabbage and chipotle mayo, lettuce", descZh: "酥炸虾仁配卷心菜和辣味蛋黄酱、生菜", price: 78 },
              { id: "qa-birria", nameEn: "Quesadilla de Birria", nameZh: "炖牛肉煎饼", descEn: "Slow-cooked beef, cheese, lettuce, onion, coriander", descZh: "慢炖牛肉、奶酪、生菜、洋葱、香菜", price: 75 },
              { id: "qa-veg", nameEn: "Quesadilla Vegetarian", nameZh: "素食煎饼", descEn: "Grilled mushrooms, bell peppers, onion, lettuce, cheese", descZh: "炒蘑菇、甜椒、洋葱、生菜、奶酪", price: 65 },
            ],
          },
          {
            id: "burritos",
            nameEn: "Burritos",
            nameZh: "墨西哥卷饼",
            items: [
              { id: "br-birria", nameEn: "Burrito de Birria", nameZh: "炖牛肉卷", descEn: "Slow-cooked beef cheek with herbs and chili, cheese, beans, lettuce, rice, onion, coriander. Served with fries", descZh: "慢炖牛脸肉配香草和辣椒、干酪豆子、生菜、米饭、洋葱、香菜配薯条", price: 78 },
              { id: "br-asada", nameEn: "Burrito de Asada Beef", nameZh: "烤牛肉卷", descEn: "Grilled marinated beef, cheese, beans, lettuce, rice, onion, coriander. Served with fries", descZh: "腌制烤牛肉、奶酪豆子、生菜、米饭、洋葱、香菜配薯条", price: 78 },
              { id: "br-pastor", nameEn: "Burrito Chicken Pastor", nameZh: "墨西哥帕多斯烤鸡肉卷饼", descEn: "Chicken marinated spiced, cheese, beans, lettuce, rice, onion, coriander. Served with fries", descZh: "腌制鸡肉、香料奶酪、豆子、生菜、米饭、洋葱、香菜配薯条", price: 75 },
              { id: "br-tinga", nameEn: "Burrito de Tinga", nameZh: "墨西哥辣鸡肉卷饼", descEn: "Shredded chicken in smoky chipotle sauce. Served with fries", descZh: "烟熏墨西哥辣椒酱鸡肉丝配薯条", price: 68 },
              { id: "br-veg", nameEn: "Vegetarian Burrito", nameZh: "素食卷饼", descEn: "Grilled mushrooms, bell peppers, onion and cheese. Served with fries", descZh: "烤蘑菇、甜椒、洋葱和奶酪配炸薯条", price: 65 },
            ],
          },
          {
            id: "burgers",
            nameEn: "Burger & Sandwiches",
            nameZh: "汉堡和三明治",
            items: [
              { id: "bg-tupac", nameEn: "The Tupac Burger", nameZh: "地狱牛肉汉堡", descEn: "Beef patty with cheese, fried pickles, pink sauce, lettuce, tomato, onions, mayonnaise. Served with fries", descZh: "牛肉饼配奶酪、炸酸黄瓜、粉红酱、生菜、西红柿、洋葱、蛋黄酱，配上薯条", price: 78 },
              { id: "bg-tupac-double", nameEn: "Tupac Double-Layered Burger", nameZh: "图帕克双层牛肉汉堡", descEn: "Double beef patty with cheese, onion, pickles, tomato, lettuce, truffle aioli, pink creole sauce on brioche bun. Served with fries", descZh: "双层牛肉饼配奶酪、洋葱、酸黄瓜、西红柿、生菜、松露蛋黄酱与粉红酱", price: 98 },
              { id: "bg-torta", nameEn: "Torta Cubana", nameZh: "古巴三明治", descEn: "Crispy bread, ground beef, grilled egg, ham, beans, sausage, cheese, tomato, lettuce, pickled. Served with fries", descZh: "脆皮面包、碎牛肉、烤鸡蛋、火腿肉、豆子、香肠、奶酪、西红柿、酸黄瓜", price: 78 },
            ],
          },
          {
            id: "mains",
            nameEn: "Grilled Plates",
            nameZh: "烤盘",
            items: [
              { id: "mn-asada", nameEn: "Carne Asada Plate", nameZh: "烤牛排拼盘", descEn: "Grilled marinated skirt steak served with salad, tomato, cabbage, cucumber, vinegar", descZh: "烤腌制裙牛排配沙拉、生菜、番茄、卷心菜、黄瓜醋", price: 128 },
              { id: "mn-lamb", nameEn: "Chops Lamb Chimichurri", nameZh: "烤羊排配奇米兹里", descEn: "Grilled lamb chops served with salad, tomato, cabbage, cucumber, vinegar", descZh: "烤羊排配沙拉、番茄、卷心菜、黄瓜醋", price: 128 },
              { id: "mn-fajitas", nameEn: "Fajitas", nameZh: "法基塔", descEn: "Grilled peppers, onions and meat of your choice on a hot cast iron skillet, with 3 sauces and 4 flour tortillas", descZh: "烤甜椒、洋葱和您选择的肉类，配3种酱汁和4张面饼", price: 78, priceAlt: [{ label: "Pastor", value: 78 }, { label: "Beef", value: 88 }, { label: "Shrimps", value: 98 }, { label: "Trio", value: 108 }] },
              { id: "mn-fish", nameEn: "Grilled Fish Fillet", nameZh: "烤鱼排拼盘", descEn: "Grilled tilapia with aji amarillo cream, served with potatoes and vegetables", descZh: "烤罗非鱼配黄辣椒奶油、搭配马铃薯和蔬菜", price: 98 },
            ],
          },
          {
            id: "specialties",
            nameEn: "Specialties",
            nameZh: "招牌",
            items: [
              { id: "sp-quesabirria", nameEn: "Corn Quesabirria Soup", nameZh: "墨西哥炖牛肉汤", descEn: "Slow-cooked beef soup served with 3 corn quesabirria", descZh: "炖牛肉汤配3个玉米煎饼", price: 78 },
            ],
          },
          {
            id: "bowls",
            nameEn: "Bowls",
            nameZh: "沙拉碗",
            items: [
              { id: "bw-birria", nameEn: "Birria Bowl", nameZh: "炖牛肉沙拉碗", descEn: "Slow-cooked beef cheek with herbs and chili, served over greens, beans and grilled vegetables", descZh: "慢炖牛腮肉配香草和辣椒搭配生菜、豆类和炒蔬菜", price: 78 },
              { id: "bw-pastor", nameEn: "Chicken Pastor Bowl", nameZh: "墨西哥帕多斯烤鸡肉沙拉碗", descEn: "Chicken pastor served over greens, beans and rice, grilled vegetables", descZh: "墨西哥鸡肉配蔬菜、豆类和米饭、炒蔬菜", price: 68 },
              { id: "bw-tinga", nameEn: "Chicken Tinga Bowl", nameZh: "墨西哥辣鸡肉沙拉碗", descEn: "Shredded chicken in smoky chipotle sauce, served over greens, beans, rice and grilled vegetables", descZh: "烟熏墨西哥辣椒酱鸡肉丝、配上蔬菜、豆类和米饭、炒蔬菜", price: 68 },
              { id: "bw-veg", nameEn: "Vegetarian Bowl", nameZh: "素食沙拉碗", descEn: "Mushrooms, bell peppers, onion and cheese, served over greens, beans, rice and grilled vegetables", descZh: "蘑菇、甜椒、洋葱和奶酪、配上蔬菜、豆类和米饭、炒蔬菜", price: 65 },
            ],
          },
        ],
      },
      {
        id: "tacos",
        nameEn: "Tacos",
        nameZh: "墨西哥塔可",
        defaultAccent: "cactus",
        groups: [
          {
            id: "tc-pieces",
            nameEn: "Trio",
            nameZh: "三件套",
            items: [
              { id: "tc-birria", nameEn: "Tacos de Birria", nameZh: "炖牛肉塔可", descEn: "Slow-cooked beef cheek with herbs and chili", descZh: "慢炖牛腮肉配香草和辣椒", price: 78 },
              { id: "tc-pastor", nameEn: "Tacos Chicken Pastor", nameZh: "墨西哥帕多斯烤鸡肉塔可", descEn: "Marinated chicken, served with onion and coriander", descZh: "腌制鸡肉、洋葱、芫荽", price: 68 },
              { id: "tc-asada", nameEn: "Tacos Asada", nameZh: "烤牛肉塔可", descEn: "Grilled marinated beef, served with onion and coriander", descZh: "腌制烤牛肉、洋葱、芫荽", price: 78 },
              { id: "tc-fish", nameEn: "Baja Fish Tacos", nameZh: "炸鱼塔可", descEn: "Crispy fish fillet with cabbage and salsa", descZh: "酥炸鱼柳配卷心菜和莎莎酱", price: 78 },
              { id: "tc-shrimp", nameEn: "Baja Shrimp Tacos", nameZh: "炸虾塔可", descEn: "Crispy shrimp with cabbage and chipotle mayo", descZh: "酥炸虾仁配卷心菜和辣味蛋黄酱", price: 78 },
              { id: "tc-tinga", nameEn: "Tacos de Tinga", nameZh: "墨西哥辣鸡肉塔可", descEn: "Shredded chicken in smoky chipotle sauce", descZh: "烟熏辣椒酱鸡肉丝", price: 68 },
              { id: "tc-veg", nameEn: "Vegetarian Tacos", nameZh: "素食塔可", descEn: "Grilled mushrooms, bell peppers, zucchini, onion", descZh: "炒蘑菇、甜椒、西葫芦和洋葱", price: 65 },
            ],
          },
          {
            id: "boards",
            nameEn: "Boards",
            nameZh: "塔可拼盘",
            items: [
              { id: "ts-tuesday", nameEn: "Tacos Tuesday Board", nameZh: "塔可周二特价", descEn: "5 choices, 2 tacos each", descZh: "5种口味塔可，每种2个", price: 168 },
              { id: "ts-board", nameEn: "Tacos Board", nameZh: "塔可组合套餐", descEn: "5 choices, 2 tacos each", descZh: "5种口味塔可，每种2个", price: 210 },
            ],
          },
        ],
      },
      {
        id: "desserts",
        nameEn: "Desserts",
        nameZh: "甜点",
        defaultAccent: "fuchsia-mx",
        items: [
          { id: "ds-churros", nameEn: "Churros", nameZh: "墨西哥油条", descEn: "Churros with chocolate sauce", descZh: "墨西哥油条配巧克力酱", price: 38 },
          { id: "ds-churros-condensado", nameEn: "Churros Condensado", nameZh: "浓缩巧克力蛋糕", descEn: "Churros with milk condensed sauce", descZh: "牛奶浓缩酱巧克力蛋糕", price: 48 },
        ],
      },
    ],
  },
  {
    id: "drinks",
    nameEn: "Drinks",
    nameZh: "酒水",
    displayEn: "Revolucion Cocktail",
    subEn: "Drinks",
    subs: [
      {
        id: "happy-hours",
        nameEn: "Happy Hours",
        nameZh: "欢乐时光",
        defaultAccent: "saffron",
        items: [
          { id: "hh-corona", nameEn: "Corona", nameZh: "科罗娜", price: 40, accent: "saffron" },
          { id: "hh-carlsberg", nameEn: "Carlsberg", nameZh: "嘉士伯", price: 55, accent: "saffron" },
          { id: "hh-ducato", nameEn: "Ducato", nameZh: "杜卡托", price: 60, accent: "saffron" },
          { id: "hh-margarita", nameEn: "Margarita", nameZh: "玛格丽特", price: 80, accent: "fuchsia-mx" },
        ],
      },
      {
        id: "cocktails",
        nameEn: "Cocktails",
        nameZh: "鸡尾酒",
        defaultAccent: "talavera",
        groups: [
          {
            id: "signature",
            nameEn: "Signature",
            nameZh: "招牌鸡尾酒",
            items: [
              { id: "sg-mr-dameisha", nameEn: "Mr Dameisha", nameZh: "MR DAMEISHA", descEn: "Italicus liquor, raspberry puree, sparkling wine", descZh: "佛手柑利口酒、树莓果茸、气泡酒", price: 80, accent: "fuchsia-mx" },
              { id: "sg-mrs-xiaomeisha", nameEn: "Mrs Xiaomeisha", nameZh: "MRS XIAOMEISHA", descEn: "Strawberry Gin, Campari infused with coffee bean, martini rosso, white cacao liquor, chocolate bitter", descZh: "草莓金酒、金巴利浸泡咖啡豆、马天尼红威末酒、白可可力娇酒、巧克力苦精酒", price: 80, accent: "fuchsia-mx" },
              { id: "sg-mrs-red", nameEn: "Mrs Red", nameZh: "MRS RED", descEn: "Olmeca, homemade turmeric syrup, cacao white liquor, lemon juice, fresh turmeric", descZh: "奥美加龙舌兰、自制姜黄根糖浆、白可可力娇酒、柠檬汁、新鲜姜黄根", price: 80, accent: "terracotta" },
              { id: "sg-mr-white", nameEn: "Mr White", nameZh: "MR WHITE", descEn: "Vodka, lemon juice, raspberry puree, cranberry juice, Cointreau", descZh: "伏特加、柠檬汁、树莓果茸、蔓越莓汁、君度", price: 80, accent: "talavera" },
              { id: "sg-mr-black", nameEn: "Mr Black", nameZh: "MR BLACK", descEn: "Havana 3 yrs rum, espresso coffee, pandan syrup, coconut puree", descZh: "哈瓦那3年朗姆、浓缩咖啡、斑兰糖浆、椰子果茸", price: 80, accent: "terracotta" },
              { id: "sg-mr-yellow", nameEn: "Mr Yellow", nameZh: "MR YELLOW", descEn: "Havana rum 3 yrs, fresh pineapple, caramel syrup, coconut puree, pineapple juice", descZh: "哈瓦那3年朗姆酒、新鲜菠萝、焦糖糖浆、椰子果茸、菠萝汁", price: 80, accent: "saffron" },
              { id: "sg-mr-green", nameEn: "Mr Green", nameZh: "MR GREEN", descEn: "Beefeater, cardamon seed, pear puree, pandan syrup, kaffir leaves", descZh: "必富达金酒、豆蔻种子、梨子果茸、斑兰糖浆、泰国青柠叶", price: 80, accent: "cactus" },
              { id: "sg-mr-orange", nameEn: "Mr Orange", nameZh: "MR ORANGE", descEn: "Jameson, fresh turmeric, fresh orange, fresh lemon, fresh lime, ginger ale", descZh: "尊美醇威士忌、新鲜姜黄根、新鲜橙子、新鲜柠檬、新鲜青柠、干姜水", price: 80, accent: "saffron" },
            ],
          },
          {
            id: "all-star",
            nameEn: "All Star",
            nameZh: "明星鸡尾酒",
            items: [
              { id: "as-bkk", nameEn: "BKK Tonic", nameZh: "BKK TONIC", descEn: "Beefeater, passion fruit, kaffir leave, coconut syrup, tonic water", descZh: "必富达金酒、椰子&百香果、泰国青柠&汤力水", price: 80, accent: "cactus" },
              { id: "as-revo", nameEn: "Revolucion Cocktail", nameZh: "REVOLUCION COCKTAIL", descEn: "Havana 3 yrs, fresh rosemary, passion fruit puree, apple juice, sugar syrup", descZh: "哈瓦那3年朗姆、糖、迷迭香、百香果、苹果", price: 80, accent: "terracotta" },
              { id: "as-cuban", nameEn: "Cuban Gentleman", nameZh: "CUBAN GENTLEMAN", descEn: "Havana 7 yrs, vanilla syrup, angostura bitter, fresh orange", descZh: "哈瓦那7年朗姆酒、香草、安格斯苦味酒、橙皮浸泡", price: 90, accent: "saffron" },
              { id: "as-bull-kiss", nameEn: "Bull Kiss", nameZh: "BULL KISS", descEn: "Absolut, vanilla syrup, raspberry puree, cranberry juice, top up with Red Bull foam", descZh: "绝对香草伏特加、树莓、蔓越莓、柠檬&香草红牛泡沫", price: 80, accent: "fuchsia-mx" },
              { id: "as-asian-colada", nameEn: "Asian Colada", nameZh: "ASIAN COLADA", descEn: "Havana 3 yrs, passion fruit puree, coconut puree, kaffir lime leaves, coconut syrup", descZh: "哈瓦那3年、百香果果茸、椰子果茸、泰国青柠叶、椰子糖浆", price: 80, accent: "saffron" },
              { id: "as-gg", nameEn: "G&G", nameZh: "G&G", descEn: "Beefeater, grapefruit syrup, grapefruit juice, tonic water", descZh: "必富达金酒、西柚、汤力水", price: 80, accent: "talavera" },
              { id: "as-passion-jager", nameEn: "Passion of Jager", nameZh: "PASSION OF JAGER", descEn: "Jagermeister, passion fruit puree, fresh lime, sugar syrup", descZh: "野格力口酒、百香果果茸、新鲜青柠、糖浆", price: 80, accent: "cactus" },
              { id: "as-vanilla-passion", nameEn: "Vanilla Passion Martini", nameZh: "VANILLA PASSION MARTINI", descEn: "Absolut, passion fruit puree, strawberry puree, vanilla syrup", descZh: "绝对香草伏特加、香草、草莓、百香果&蛋清", price: 90, accent: "fuchsia-mx" },
            ],
          },
          {
            id: "classic",
            nameEn: "Classic",
            nameZh: "经典鸡尾酒",
            items: [
              { id: "cl-mai-tai", nameEn: "Mai Tai", nameZh: "MAI TAI", descEn: "Havana 3 yrs, Havana 7 yrs, fresh lime, orgeat syrup, orange curaçao", descZh: "哈瓦那3年、哈瓦那7年、新鲜青柠、杏仁糖浆、橙皮利口酒", price: 80 },
              { id: "cl-old-fashioned", nameEn: "Old Fashioned", nameZh: "OLD FASHIONED", descEn: "Jim Beam, sugar, fresh orange, angostura bitter", descZh: "占边威士忌、糖、新鲜橙子、安格斯苦精酒", price: 80 },
              { id: "cl-pisco-sour", nameEn: "Pisco Sour", nameZh: "PISCO SOUR", descEn: "Pisco, lemon juice, sugar syrup, angostura bitter, egg white", descZh: "皮斯克酒、柠檬汁、糖浆、安格斯苦精酒、蛋清", price: 80 },
              { id: "cl-penicillin", nameEn: "Penicillin", nameZh: "PENICILLIN", descEn: "Ballantine's whisky, Laphroaig, ginger honey syrup, lemon juice", descZh: "百龄坛威士忌、拉弗格威士忌、生姜蜂蜜糖浆、柠檬汁", price: 80 },
              { id: "cl-paloma", nameEn: "Paloma", nameZh: "PALOMA", descEn: "Olmeca, grapefruit syrup, grapefruit juice, soda water", descZh: "奥美加龙舌兰、西柚糖浆、西柚汁、苏打水", price: 80 },
              { id: "cl-negroni", nameEn: "Negroni", nameZh: "NEGRONI", descEn: "Beefeater, martini rosso, Campari", descZh: "必富达金酒、马天尼红威末酒、金巴利利口酒", price: 80 },
              { id: "cl-margarita", nameEn: "Margarita", nameZh: "MARGARITA", descEn: "Olmeca tequila, fresh lime, triple sec", descZh: "奥美加龙舌兰、新鲜青柠、柑橘味利口酒", price: 80 },
              { id: "cl-mojito", nameEn: "Mojito", nameZh: "MOJITO", descEn: "Havana 3 yrs, fresh lime, fresh mint, lime juice, sugar syrup", descZh: "哈瓦那3年、新鲜青柠、新鲜薄荷、青柠汁、糖浆", price: 80 },
              { id: "cl-zombie", nameEn: "Zombie", nameZh: "ZOMBIE", descEn: "Havana 3 yrs, Havana 7 yrs, overproof rum, lemon juice, grapefruit juice, grenadine syrup", descZh: "哈瓦那3年、哈瓦那7年、高浓度朗姆酒、柠檬汁、西柚汁、石榴糖浆", price: 80 },
              { id: "cl-pina-colada", nameEn: "Pina Colada", nameZh: "PINA COLADA", descEn: "Havana 3 yrs, fresh pineapple, pineapple juice, coconut puree, coconut syrup", descZh: "哈瓦那3年、新鲜菠萝、菠萝汁、椰子果茸、椰子糖浆", price: 80 },
              { id: "cl-aperol", nameEn: "Aperol Spritz", nameZh: "APEROL SPRITZ", descEn: "Aperol, sparkling wine, soda water, fresh orange", descZh: "奥佩罗利口酒、气泡酒、苏打水、新鲜橙子", price: 80 },
              { id: "cl-gin-fizz", nameEn: "Gin Fizz", nameZh: "GIN FIZZ", descEn: "Beefeater, lemon juice, sugar syrup, egg white, top soda water", descZh: "必富达金酒、柠檬汁、糖浆、蛋清、苏打水", price: 80 },
              { id: "cl-godfather", nameEn: "God Father", nameZh: "GOD FATHER", descEn: "Jameson, Disaronno", descZh: "尊美醇威士忌、蒂萨诺力娇酒", price: 80 },
              { id: "cl-caipirinha", nameEn: "Caipirinha", nameZh: "CAIPIRINHA", descEn: "Cachaça, fresh lime, sugar", descZh: "卡沙萨酒、新鲜青柠、糖", price: 80 },
              { id: "cl-whisky-sour", nameEn: "Whisky Sour", nameZh: "WHISKY SOUR", descEn: "Jameson, lemon juice, sugar syrup, angostura bitter, egg white", descZh: "尊美醇威士忌、柠檬汁、糖浆、安格斯苦精酒、蛋清", price: 80 },
              { id: "cl-moscow-mule", nameEn: "Moscow Mule", nameZh: "MOSCOW MULE", descEn: "Absolut Vodka, lime juice, sugar syrup, angostura bitter, ginger beer", descZh: "绝对伏特加、糖、青柠、安格斯苦味酒&姜味啤酒", price: 80 },
              { id: "cl-long-island", nameEn: "Long Island", nameZh: "LONG ISLAND", descEn: "Tequila, Vodka, White Rum, Gin, Triple sec, fresh lemon juice, sugar syrup", descZh: "绝对伏特加、必富达金酒、奥美加龙舌兰、橙皮力娇酒、柠檬汁、可乐", price: 90 },
            ],
          },
          {
            id: "mocktail",
            nameEn: "Mocktail",
            nameZh: "无酒精鸡尾酒",
            items: [
              { id: "mt-oasis", nameEn: "Oasis Berry", nameZh: "OASIS BERRY", descEn: "Apple juice, cassis syrup, raspberry puree", descZh: "苹果汁、黑醋栗糖浆、树莓果茸", price: 60 },
              { id: "mt-apple-mojito", nameEn: "Apple Mojito", nameZh: "APPLE MOJITO", descEn: "Mint, lime, sugar, apple juice", descZh: "薄荷、青柠、糖、苹果汁", price: 60 },
              { id: "mt-pink-grapefruit", nameEn: "Pink Grapefruit Fizz", nameZh: "PINK GRAPEFRUIT FIZZ", descEn: "Grapefruit juice, grapefruit syrup, soda water", descZh: "西柚汁、西柚糖浆、苏打水", price: 60 },
              { id: "mt-red-berry", nameEn: "Red Berry", nameZh: "RED BERRY", descEn: "Raspberry, strawberry, cranberry juice, lime and sugar", descZh: "树莓、草莓、蔓越莓汁、青柠、糖", price: 60 },
              { id: "mt-yu-garden", nameEn: "Yu Garden", nameZh: "YU GARDEN", descEn: "Apple juice, cardamon seed, pear puree, pandan syrup, kaffir leaves", descZh: "苹果汁、豆蔻种子、梨子果茸、斑兰糖浆、泰国青柠叶", price: 60 },
            ],
          },
          {
            id: "lupita-cocktails",
            nameEn: "Lupita Cocktails",
            nameZh: "露佩塔特调",
            items: [
              { id: "lc-frozen-margarita-glass", nameEn: "Frozen Margarita (Glass)", nameZh: "冰冻玛格丽特（杯）", price: 80, accent: "saffron" },
              { id: "lc-frozen-margarita-jug", nameEn: "Frozen Margarita (Jug 1L)", nameZh: "冰冻玛格丽特（1升壶）", price: 198, accent: "saffron" },
              { id: "lc-paloma-lupita", nameEn: "Paloma", nameZh: "帕洛玛", price: 80, accent: "fuchsia-mx" },
              { id: "lc-cantarito", nameEn: "Cantarito", nameZh: "坎塔里托", price: 80, accent: "terracotta" },
              { id: "lc-batanga", nameEn: "Batanga", nameZh: "巴坦加", price: 80, accent: "terracotta" },
              { id: "lc-margarita-lupita", nameEn: "Margarita", nameZh: "玛格丽特", price: 80, accent: "cactus" },
              { id: "lc-water", nameEn: "Water", nameZh: "矿泉水", price: 10, accent: "talavera" },
            ],
          },
        ],
      },
      {
        id: "shots",
        nameEn: "Shots",
        nameZh: "子弹杯",
        defaultAccent: "fuchsia-mx",
        items: [
          { id: "sh-tequila", nameEn: "Tequila Shot", nameZh: "龙舌兰子弹杯", price: 35, priceAlt: [{ label: "×1", value: 35 }, { label: "×12", value: 380 }], accent: "fuchsia-mx" },
          { id: "sh-fireball", nameEn: "Fireball", nameZh: "火球", price: 40, priceAlt: [{ label: "×1", value: 40 }, { label: "×12", value: 400 }], accent: "fuchsia-mx" },
          { id: "sh-woowoo", nameEn: "Woo Woo", nameZh: "WOO WOO", descEn: "Absolut Vodka, Peach liquor, Cranberry juice", descZh: "绝对伏特加、蜜桃酒、蔓越莓汁", price: 40, priceAlt: [{ label: "×1", value: 40 }, { label: "×12", value: 400 }], accent: "fuchsia-mx" },
          { id: "sh-tropicana", nameEn: "Tropicana", nameZh: "热带风情", descEn: "Havana Club 3Yo Rum, Pineapple juice, Passion syrup", descZh: "哈瓦那3年朗姆酒、菠萝汁、百香果糖浆", price: 40, priceAlt: [{ label: "×1", value: 40 }, { label: "×12", value: 400 }], accent: "fuchsia-mx" },
          { id: "sh-madeleine", nameEn: "Madeleine", nameZh: "玛德莲", descEn: "Disaronno, Triple sec, Pineapple juice", descZh: "DISARONNO杏仁力娇酒、君度橙酒、菠萝汁", price: 40, priceAlt: [{ label: "×1", value: 40 }, { label: "×12", value: 400 }], accent: "fuchsia-mx" },
          { id: "sh-kiss-cool", nameEn: "Kiss Cool", nameZh: "酷吻", descEn: "Get 27, Absolut Vodka", descZh: "GET 27薄荷力娇酒、绝对伏特加", price: 40, priceAlt: [{ label: "×1", value: 40 }, { label: "×12", value: 400 }], accent: "fuchsia-mx" },
          { id: "sh-godfather", nameEn: "Little Godfather", nameZh: "小教父", descEn: "Disaronno, Jack Daniels", descZh: "DISARONNO杏仁力娇酒、杰克丹尼威士忌", price: 45, priceAlt: [{ label: "×1", value: 45 }, { label: "×12", value: 480 }], accent: "fuchsia-mx" },
          { id: "sh-blowjob", nameEn: "Blow Job", nameZh: "吹喇叭", descEn: "Baileys, Kahlua, Chantilly", descZh: "百利甜酒、咖啡力娇酒、奶油", price: 45, priceAlt: [{ label: "×1", value: 45 }, { label: "×12", value: 480 }], accent: "fuchsia-mx" },
          { id: "sh-b52", nameEn: "B52", nameZh: "B52轰炸机", descEn: "Kahlua, Baileys, Triple sec", descZh: "咖啡力娇酒、百利甜酒、君度橙酒", price: 45, priceAlt: [{ label: "×1", value: 45 }, { label: "×12", value: 480 }], accent: "fuchsia-mx" },
          { id: "sh-jager-bomb", nameEn: "Jager Bomb", nameZh: "野格炸弹", descEn: "Jagermeister, Redbull", descZh: "野格力娇酒、红牛", price: 60, priceAlt: [{ label: "×1", value: 60 }, { label: "×12", value: 650 }], accent: "fuchsia-mx" },
          { id: "sh-alien", nameEn: "Alien Brain Hemorrhage", nameZh: "外星人大脑出血", descEn: "Peach liquor, Blue curacao, Baileys & Grenadine", descZh: "蜜桃力娇酒、蓝橙力娇酒、百利甜酒、红石榴糖浆", price: 60, priceAlt: [{ label: "×1", value: 60 }, { label: "×12", value: 650 }], accent: "fuchsia-mx" },
          { id: "sh-very-bad-trip", nameEn: "Very Bad Trip", nameZh: "狂暴之路", descEn: "Absolut Vodka, Olmeca Tequila, Jager Bomb", descZh: "绝对伏特加、奥美加龙舌兰、野格炸弹", price: 90, priceAlt: [{ label: "×1", value: 90 }, { label: "×12", value: 980 }], accent: "fuchsia-mx" },
        ],
      },
      {
        id: "wines",
        nameEn: "Wines",
        nameZh: "红酒",
        defaultAccent: "terracotta",
        items: [
          { id: "wn-white", nameEn: "House White Wine", nameZh: "招牌白葡萄酒", price: 60, priceAlt: [{ label: "Glass", value: 60 }, { label: "Bottle", value: 320 }] },
          { id: "wn-prosecco", nameEn: "House Prosecco Wine", nameZh: "招牌起泡酒", price: 70, priceAlt: [{ label: "Glass", value: 70 }, { label: "Bottle", value: 390 }] },
          { id: "wn-red", nameEn: "House Red Wine", nameZh: "招牌红葡萄酒", price: 60, priceAlt: [{ label: "Glass", value: 60 }, { label: "Bottle", value: 320 }] },
        ],
      },
      {
        id: "beers",
        nameEn: "Beers",
        nameZh: "啤酒",
        defaultAccent: "saffron",
        groups: [
          {
            id: "towers",
            nameEn: "Towers",
            nameZh: "啤酒塔",
            items: [
              { id: "be-carlsberg-tower", nameEn: "Carlsberg Tower", nameZh: "嘉士伯酒塔", price: 248 },
              { id: "be-ducato-tower", nameEn: "Ducato IPA Tower", nameZh: "杜卡托IPA酒塔", price: 298 },
            ],
          },
          {
            id: "draft",
            nameEn: "Draft Beers",
            nameZh: "生啤",
            items: [
              { id: "be-carlsberg", nameEn: "Carlsberg (Draft)", nameZh: "嘉士伯生啤", price: 55 },
              { id: "be-ducato", nameEn: "Ducato", nameZh: "杜卡托", price: 60 },
            ],
          },
          {
            id: "imported",
            nameEn: "Imported Belgian Beers",
            nameZh: "进口比利时啤酒",
            items: [
              { id: "be-blanche-bruges", nameEn: "Blanche de Bruges", nameZh: "布鲁日白啤", descEn: "33cl", price: 40 },
              { id: "be-rose-bruges", nameEn: "Rosé de Bruges", nameZh: "布鲁日玫瑰", descEn: "33cl", price: 45 },
              { id: "be-vedett-elderflower", nameEn: "Vedett Extra Elderflower", nameZh: "白熊接骨木花", descEn: "33cl", price: 45 },
              { id: "be-hoegaarden", nameEn: "Hoegaarden White", nameZh: "福佳白啤酒", price: 50, priceAlt: [{ label: "×1", value: 50 }, { label: "×12", value: 500 }] },
              { id: "be-duvel-citra", nameEn: "Duvel Tripel Hop Citra", nameZh: "督威三倍啤酒", descEn: "33cl", price: 60 },
            ],
          },
          {
            id: "latinos",
            nameEn: "Latino Beers",
            nameZh: "拉丁啤酒",
            items: [
              { id: "be-corona", nameEn: "Corona", nameZh: "科罗娜", price: 40, priceAlt: [{ label: "×1", value: 40 }, { label: "×12", value: 420 }] },
              { id: "be-chelada", nameEn: "Chelada", nameZh: "切拉达", price: 45 },
              { id: "be-michelada", nameEn: "Michelada", nameZh: "米切拉达", price: 80 },
              { id: "be-coronarita", nameEn: "Coronarita", nameZh: "科罗娜玛格丽特", price: 90 },
            ],
          },
        ],
      },
      {
        id: "softs",
        nameEn: "Soft Drinks",
        nameZh: "软饮",
        defaultAccent: "talavera",
        groups: [
          {
            id: "softs-30",
            nameEn: "Soft Drinks",
            nameZh: "软饮",
            items: [
              { id: "sd-coke", nameEn: "Coca Cola", nameZh: "可口可乐", price: 30 },
              { id: "sd-coke-zero", nameEn: "Coca Cola Zero", nameZh: "可口可乐零度", price: 30 },
              { id: "sd-sprite", nameEn: "Sprite", nameZh: "雪碧", price: 30 },
              { id: "sd-ginger-ale", nameEn: "Ginger Ale", nameZh: "姜汁汽水", price: 30 },
              { id: "sd-soda", nameEn: "Soda Water", nameZh: "苏打水", price: 30 },
              { id: "sd-tonic", nameEn: "Tonic Water", nameZh: "汤力水", price: 30 },
            ],
          },
          {
            id: "energy",
            nameEn: "Energy & Specials",
            nameZh: "特饮",
            items: [
              { id: "en-redbull", nameEn: "Red Bull", nameZh: "红牛", price: 40 },
              { id: "en-ginger-beer", nameEn: "Ginger Beer", nameZh: "姜味啤酒", price: 40 },
            ],
          },
          {
            id: "lupita-iced-tea",
            nameEn: "Lupita Iced Tea Drinks",
            nameZh: "露佩塔冰茶饮品",
            items: [
              { id: "li-lemonade-tea", nameEn: "Ice Lemonade Tea", nameZh: "冰柠檬茶", price: 30 },
              { id: "li-jamaica", nameEn: "Jamaica Water", nameZh: "洛神花水", price: 40 },
            ],
          },
        ],
      },
      {
        id: "shisha",
        nameEn: "Shisha",
        nameZh: "水烟",
        defaultAccent: "cactus",
        groups: [
          {
            id: "lavii",
            nameEn: "Lavii Flavors",
            nameZh: "尊享系列",
            items: [
              { id: "lv-victoria", nameEn: "Victoria Orchard", nameZh: "维多利亚果园", descEn: "Litchi, floral scent, Earl Grey tea", descZh: "荔枝、花香、伯爵茶", price: 288, accent: "fuchsia-mx" },
              { id: "lv-utopia", nameEn: "Utopia", nameZh: "乌托邦", descEn: "Watermelon, lychee, mango", descZh: "西瓜、荔枝、芒果", price: 288, accent: "saffron" },
              { id: "lv-samba", nameEn: "Samba Style", nameZh: "桑巴风情", descEn: "Jasmine, mango, pitaya", descZh: "茉莉花、芒果、火龙果", price: 288, accent: "terracotta" },
              { id: "lv-passion", nameEn: "Old Passion Man", nameZh: "百香巴西佬", descEn: "Passion fruit, pineapple, Brazilian tea", descZh: "百香果、菠萝、巴西茶", price: 288, accent: "saffron" },
            ],
          },
          {
            id: "revo-originals",
            nameEn: "Revo Originals",
            nameZh: "经典系列",
            items: [
              { id: "rv-love66", nameEn: "Love 66", nameZh: "LOVE 66", descEn: "A sweet, refreshing fusion of watermelon and cool mint", descZh: "清甜西瓜与沁凉薄荷的完美融合", price: 218, accent: "fuchsia-mx" },
              { id: "rv-lady-killer", nameEn: "Lady Killer", nameZh: "少女杀手", descEn: "Discovering what kills ladies", descZh: "探索俘获芳心的秘密", price: 218, accent: "fuchsia-mx" },
              { id: "rv-double-apple", nameEn: "Double Apple", nameZh: "双苹果", descEn: "Red and green apples with a hint of anise", descZh: "红青苹果经典碰撞，伴着淡淡的茴香味", price: 218, accent: "cactus" },
              { id: "rv-peach", nameEn: "Peach", nameZh: "水蜜桃", descEn: "Juicy, fragrant, summer freshness", descZh: "爆汁鲜果、夏日清新气息", price: 218, accent: "saffron" },
              { id: "rv-mint", nameEn: "Mint", nameZh: "薄荷", descEn: "Refreshing boost to any session", descZh: "提神醒脑最佳", price: 218, accent: "cactus" },
              { id: "rv-ice-watermelon", nameEn: "Ice Watermelon", nameZh: "冰西瓜", descEn: "Juicy, refreshing, sweet with a cooling finish", descZh: "鲜嫩多汁、甘甜可口", price: 218, accent: "talavera" },
            ],
          },
        ],
      },
    ],
  },
];
