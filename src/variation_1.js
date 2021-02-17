import testConfig from "./modules/testConfig/testConfig.js"
import variationCSS from "./modules/testConfig/variation-1.css";

import addStylesToDOM from "./modules/genericFunctions/addStylesToDOM.js"
import watchForChange from "./modules/genericFunctions/watchForChange.js"
import pollFunction from "./modules/genericFunctions/pollFunction.js"
import isMobileSite from "./modules/genericFunctions/isMobileSite.js"
import gaSendEvent from "./modules/genericFunctions/gaSendEvent.js"
import beethoven from "./modules/genericFunctions/beethoven.js"

testConfig["variant"] = "Control"
const bodyClass = `${testConfig.id}_loaded`.replace(/ /g, '-').toLowerCase()
const isMoble = isMobileSite()

function getProdCode() {
	let prodImgEl = document.querySelector('.dth-add-to-basket__image')
	let source = prodImgEl.getAttribute('src')
	let productCode = source.split('/').pop().replace(".jpg", "")
	return productCode
}

function buildProductEl(product, single = true) {
	// id, imageURL, linkURL, name, price
	return `<div class="rr_product">
		<div class="image_container">
			<img src="${product.imageURL}" alt="${product.name}" />
		</div>
		<div class="info_container">
			<h4 class="title">${product.name}</h4>
			<h5 class="price">£${product.price}</h5>
			<span class="btn dth-rr__btn" href="${product.linkURL}">More detail</span>
		</div>
	</div>`
}

function init() {
	beethoven('Init Function Called')
	if (!document.body.classList.contains(bodyClass)) {
		document.body.classList.add(bodyClass);
		addStylesToDOM(variationCSS)

		let placementName = 'add_to_cart_page.Popupaddtocart'
		let targetNode = document.querySelector('[data-module="dth_add_to_basket"]')
		watchForChange(targetNode, _ => {
			RR.jsonCallback = function(){
				let elAlreadyExists = document.querySelector('.rr_product_container') !== null
				if (elAlreadyExists) {
					document.querySelector('.rr_product_container').remove()
				}
				// Place your rendering logic here. Actual code varies depending on your website implementation.
				let placements = RR.data.JSON.placements
				let addToCartPlacement = placements.filter( a => a.placement_name === placementName)[0]
				let products = addToCartPlacement.items
				let message = isMoble ? "Customers also bought..." : "Customers who bought this also bought..."
				let productEl = buildProductEl(products[0])
				let el = `<div class="rr_product_container">${productEl}</div>`
				targetNode.insertAdjacentHTML('beforeend', el)
			};

			if(typeof R3_ITEM !=='undefined') R3_ITEM = undefined;
			R3_COMMON.placementTypes='';
			//if used on the item page previously
			R3_COMMON.categoryHintIds='';

			R3_COMMON.addPlacementType(placementName);

			var R3_ADDTOCART = new r3_addtocart();
			R3_ADDTOCART.addItemIdToCart(getProdCode());

			rr_flush_onload();

			r3(); 
		}, {attributes: true, attributeFilter: ["class"]})
	}
}

function pollConditions() {
	const conditions = typeof r3 !== "undefined"
		&& typeof RR !== "undefined"
		&& typeof R3_COMMON !== "undefined"
		&& typeof r3_addtocart !== "undefined"
		&& typeof rr_flush_onload !== "undefined"
		&& document.querySelector('[data-module="dth_add_to_basket"]') !== null

	beethoven(`Polling: Conditions = ${conditions}`)
	return conditions
}

beethoven(`${testConfig["variant"]} Code Loaded`)
pollFunction(pollConditions, init)