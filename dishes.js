/* Platos fitness argentinos armados SOLO con alimentos de la tabla (USDA). Cantidades por porción. */
var DISHES=[
{name:'Pollo con arroz',alias:['arroz con pollo'],emoji:'🍗',items:[['Pechuga de pollo (sin piel)|cocido',150],['Arroz blanco|cocido',150],['Aceite de oliva|—',5]]},
{name:'Tortilla de claras',alias:['omelette de claras','revuelto de claras'],emoji:'🍳',items:[['Clara de huevo|crudo',165],['Huevo entero|crudo',50],['Espinaca|crudo',30],['Aceite de oliva|—',3]]},
{name:'Ensalada completa',alias:['ensalada mixta'],emoji:'🥗',items:[['Lechuga|crudo',60],['Tomate|crudo',100],['Zanahoria|crudo',50],['Huevo duro|cocido',50],['Choclo|cocido',40],['Aceite de oliva|—',5]]},
{name:'Milanesa al horno',alias:['milanesa','milanesas al horno','milanga'],emoji:'🥩',items:[['Nalga|crudo',150],['Huevo entero|crudo',25],['Pan rallado|—',30]]},
{name:'Milanesa de pollo al horno',alias:['milanesa de pollo'],emoji:'🍗',items:[['Pechuga de pollo (sin piel)|crudo',150],['Huevo entero|crudo',25],['Pan rallado|—',30]]},
{name:'Bife con ensalada',alias:['bife con ensalada mixta'],emoji:'🥩',items:[['Bife de chorizo|cocido',200],['Lechuga|crudo',60],['Tomate|crudo',100],['Aceite de oliva|—',5]]},
{name:'Avena con banana',alias:['porridge','avena con banana y canela'],emoji:'🥣',items:[['Avena arrollada|crudo',50],['Leche descremada|—',200],['Banana|—',118]]},
{name:'Yogur con granola y frutillas',alias:['yogur con granola','bowl de yogur'],emoji:'🍓',items:[['Yogur natural descremado|—',200],['Granola|—',30],['Frutilla|—',100]]},
{name:'Guiso de lentejas fit',alias:['guiso de lentejas','lentejas guisadas'],emoji:'🍲',items:[['Lentejas|cocido',200],['Carne picada magra (95/5)|cocido',80],['Zanahoria|cocido',50],['Cebolla|crudo',40],['Morrón rojo|crudo',30],['Salsa de tomate|—',60]]},
{name:'Wok de pollo y verduras',alias:['wok de pollo','salteado de pollo'],emoji:'🥘',items:[['Pechuga de pollo (sin piel)|cocido',150],['Brócoli|cocido',80],['Morrón rojo|crudo',50],['Zanahoria|crudo',50],['Cebolla|crudo',40],['Aceite de oliva|—',5]]},
{name:'Fideos con atún',alias:['fideos con atun','pasta con atún'],emoji:'🍝',items:[['Fideos secos (trigo)|cocido',200],['Atún al natural (lata)|cocido',120],['Salsa de tomate|—',80]]},
{name:'Revuelto de zapallitos',alias:['revuelto de zucchini'],emoji:'🥒',items:[['Zapallito|cocido',200],['Huevo entero|crudo',100],['Cebolla|crudo',40],['Aceite de oliva|—',3]]},
{name:'Batata al horno con huevo',alias:['batata con huevo'],emoji:'🍠',items:[['Batata|cocido',200],['Huevo duro|cocido',100]]},
{name:'Licuado proteico',alias:['batido proteico','shake proteico','licuado de proteina'],emoji:'🥤',items:[['Leche descremada|—',250],['Proteína whey (suero)|—',30],['Banana|—',118]]},
{name:'Tostadas con ricota',alias:['tostadas con ricota y mermelada'],emoji:'🍞',items:[['Pan integral|—',64],['Ricota descremada|—',50],['Mermelada light|—',15]]},
{name:'Hamburguesa casera fit',alias:['hamburguesa casera','hamburguesa fit'],emoji:'🍔',items:[['Carne picada magra (95/5)|cocido',150],['Pan integral|—',64],['Lechuga|crudo',20],['Tomate|crudo',50]]},
{name:'Merluza con puré de calabaza',alias:['merluza con pure','merluza con calabaza'],emoji:'🐟',items:[['Merluza|cocido',200],['Zapallo|cocido',200],['Aceite de oliva|—',5]]},
{name:'Pechuga con papas al horno',alias:['pollo con papas'],emoji:'🥔',items:[['Pechuga de pollo (sin piel)|cocido',150],['Papa hervida|cocido',200],['Aceite de oliva|—',5]]},
{name:'Tarta de verdura light',alias:['tarta de acelga','tarta de verdura'],emoji:'🥧',items:[['Acelga|cocido',150],['Ricota descremada|—',60],['Huevo entero|crudo',50],['Tortillas / rapiditas|—',50],['Queso parmesano rallado|—',10]]},
{name:'Bowl de quinoa',alias:['ensalada de quinoa'],emoji:'🥗',items:[['Quinoa|cocido',150],['Garbanzos|cocido',80],['Tomate|crudo',80],['Pepino|crudo',60],['Palta|—',50],['Aceite de oliva|—',5]]},
{name:'Desayuno fit',alias:['desayuno de campeones'],emoji:'☕',items:[['Pan integral|—',64],['Huevo revuelto|cocido',100],['Café|—',200],['Naranja|—',130]]},
{name:'Yogur con avena',alias:['yogur con avena y banana'],emoji:'🥣',items:[['Yogur griego descremado|—',170],['Avena arrollada|crudo',30],['Banana|—',60]]},
{name:'Pollo al verdeo light',alias:[],emoji:'🍗',items:[['Pechuga de pollo (sin piel)|cocido',150],['Cebolla|crudo',50],['Leche descremada|—',80],['Arroz integral|cocido',120]]},
{name:'Cerdo con batata',alias:['bondiola con batata','lomo de cerdo con batata'],emoji:'🐖',items:[['Lomo de cerdo|cocido',150],['Batata|cocido',200]]}
];
if(typeof module!=='undefined')module.exports=DISHES;
