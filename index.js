'use strict';

/**
 * <CatalogMgr>
 *     getSiteCatalog() => Retourne le <Catalog> ou se trouve les categories a exporter (le storefront-catalog)
 *     getCategory(categoryID) => Retourne une <Category>
 *
 * ----------------------------------------------------
 *
 * <Catalog>
 *     ID : l'id du catalog
 *     root : la category root du catalog
 *
 * ----------------------------------------------------
 *
 * <Category>
 *     ID : l'id de la category
 *     products : Collection<Product>
 *     subCategories : Collection<Category>
 *
 * ----------------------------------------------------
 *
 * <Collection> : Une emulation de collection Java que vous devez utiliser avec un iterator
 *     size() => Retourne la taille de la collection
 *     iterator() => Retourne un <Iterator>
 *
 * ----------------------------------------------------
 *
 * <Iterator> : Un objet permettant de parcourir une large collection
 *     hasNext() => Retourne true si la collection possède un element suivant, false sinon
 *     next() => Retourne l'element suivant ou lance une erreur s'il n'y en a pas
 *
 */
const CatalogMgr = require('dw/catalog/CatalogMgr');

/**
 * @class FileWriter
 *
 * const writer = new FileWriter('path to file');
 *
 * <writer>
 *     write(String) => Ecrit la chaine dans le fichier
 *     close() => Ferme le fichier : Attention, la fermeture du ficher est obligatoire sinon il vous manquera peut être des lignes
 */
const writer = new (require('FileWriter'))(require('path').resolve(__dirname,'./output.xml'));
const js2xml = require('xml-js').js2xml;

const catalog = CatalogMgr.getSiteCatalog();
const root = catalog.root;
const subcats = root.subCategories;

let template =
{
    "_declaration": {
        "_attributes":
        {"version":"1.0","encoding":"UTF-8"}
    },
    "catalog": {
        "_attributes":
        {"xmlns":"xxx","catalog-id":"miditech-storefront-catalog-fr"},
        "_text": "@@"
    }
}
let result = js2xml(template, {compact: true, spaces: 4});
result = result.split('@@');

writer.write(result[0]);

let iterator = subcats.iterator();
while (iterator.hasNext()) {
    let cat = iterator.next();
    let catId = cat.ID;
    let prodIte = cat.products.iterator();
    while (prodIte.hasNext()) {
        let prod = prodIte.next();
        let catAssNode =
        {
            "category-assignment": {
                "_attributes":
                {"category-id": catId,"product-id":prod.ID}
            }
        }
        let catAssNodeXml = js2xml(catAssNode, {compact: true, spaces: 4});

        writer.write(catAssNodeXml)
        
    }
}

writer.write(result[1]);

writer.close();