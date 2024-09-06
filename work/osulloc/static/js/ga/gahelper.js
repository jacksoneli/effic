// @file ga/gahelper.js

function GAHelper(dataLayer) {
    // parameter
    this.dataLayer = dataLayer;
    this.customObject;
    this.products = new Array(); // EEC용 상품 모음

    // 상수
    this.CLIENT_COUNTRY = this.chkCountry();
    this.CLIENT_LANGUAGE = this.chkLanguage();
    this.CLIENT_PLATFORM = this.chkPlatform();
    this.SERVER_DEV = this.chkServer();
    this.VIEW_LOG = this.SERVER_DEV; // 로그
    this.TRACKING_ID = this.SERVER_DEV ? 'UA-110770460-9' : 'UA-110770460-6';
    this.GTM_ADD_PROP = this.SERVER_DEV ? "&gtm_auth=6TtwThB9rKTooI2qoTp3lA&gtm_preview=env-15&gtm_cookies_win=x" : "";
}

GAHelper.prototype.makeScriptGA_Analytics = function(trackingId) {
    (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function() {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
    ga('create', trackingId, 'auto');
};

GAHelper.prototype.pushCustom = function() {
    var co = this.customObject;
    var oco = {}; // ordered custom object
    Object.keys(co).sort(function (a, b){
        var ia = parseInt(a.replace('dimension', ''));
        var ib = parseInt(b.replace('dimension', ''));
        return ia < ib ? -1 : ia > ib ? 1 : 0;
    }).forEach(function(key) {
        oco[key] = co[key];
    });

    for (var key in oco) {
        ga('set', key, oco[key]);
    }

    this.dataLayer.push(oco);
};

GAHelper.prototype.setCustomCommon = function() {
    // 공통 변수 세팅
    this.customObject.dimension10 = "OSULLOC";
    this.customObject.dimension11 = this.CLIENT_PLATFORM;
    this.customObject.dimension12 = this.CLIENT_COUNTRY;
    this.customObject.dimension13 = this.CLIENT_LANGUAGE;
};

GAHelper.prototype.makeScriptGA_TagManager = function(addProp) {
    // Google Tag Manager
    (function (w, d, s, l, i) {
        w[l] = w[l] || [];w[l].push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl + addProp;f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'gv_DataLayer', 'GTM-5Q5T3GF');

    window.onload = function () {
        var str = "<noscript><iframe src='https://www.googletagmanager.com/ns.html?id=GTM-5Q5T3GF" + addProp + "' height='0' width='0' style='display:none;visibility:hidden'></iframe></noscript>";
        $("body").prepend(str);
    };
};

GAHelper.prototype.eecPush = function(step, products, order) {
    var pushObj = new Object();
    var ecommerce = new Object();
    var event = new Object();
    var actionField = new Object();

    /**/

    ecommerce['currencyCode'] = "KRW";
    pushObj['event'] = step.replace(/\b\w/g, function (l) {
        return l.toUpperCase();
    });

    var seperator = step.toLowerCase();

    switch (seperator) {
        case 'click':
            actionField['list'] = order['product_list'];

            event['actionField'] = actionField;
            event['products'] = products;

            ecommerce[pushObj['event'].toLowerCase()] = event;

            pushObj['ecommerce'] = ecommerce;
            break;
        case 'detail':
        case 'add':
        case 'remove':
            event['products'] = products;

            ecommerce[pushObj['event'].toLowerCase()] = event;

            pushObj['ecommerce'] = ecommerce;
            break;

        case 'checkout1':
        case 'checkout2':
            actionField['step'] = seperator == 'checkout1' ? 1 : 2;
            if (seperator == 'checkout2') {
                actionField['option'] = order['checkout_option'];
            }

            event['actionField'] = actionField;
            event['products'] = products;

            ecommerce['checkout'] = event;

            pushObj['ecommerce'] = ecommerce;

            break;
        case 'purchase':
            // 포장 서비스 추가 구매시?
            pushObj['dimension33'] = order['dimension33'];
            pushObj['dimension56'] = order['dimension56'];
            pushObj['metric3'] = order['metric3'];
            pushObj['metric4'] = order['metric4'];
            pushObj['metric5'] = order['metric5'];
            pushObj['metric13'] = order['metric13'];

            actionField['id'] = order['id'];
            actionField['revenue'] = order['revenue'];
            actionField['tax'] = order['tax'];
            actionField['shipping'] = order['shipping'];
            actionField['coupon'] = order['coupon'];

            event['actionField'] = actionField;
            event['products'] = products;

            ecommerce[pushObj['event'].toLowerCase()] = event;

            pushObj['ecommerce'] = ecommerce;
            break;
        case 'refund':
            actionField['id'] = order['id'];

            event['actionField'] = actionField;
            if (products) {
                event['products'] = products;
            }
            ecommerce[pushObj['event'].toLowerCase()] = event;

            pushObj['ecommerce'] = ecommerce;
            break;

        default:
            break;
    }

    this.dataLayer.push(pushObj);
    // console.log(JSON.stringify(pushObj, 0, 2));
};

GAHelper.prototype.eecClick = function(po, position, product_list) {
    var products = new Array();
    var product = new Object();

    product['id'] = po.id;
    product['name'] = po.name;
    product['brand'] = po.brand;
    product['category'] = po.category;
    product['position'] = position > 0 ? position : undefined;
    product['dimension32'] = po.dimension32;
    product['dimension34'] = po.dimension34;

    products.push(product);

    var order = new Object();

    order['product_list'] = product_list;

    this.eecPush('click', products, order);
};
GAHelper.prototype.eecDetail = function(po) {
    var products = new Array();
    var product = new Object();

    product['id'] = po.id;
    product['name'] = po.name;
    product['brand'] = po.brand;
    product['category'] = po.category;
    product['dimension32'] = po.dimension32;
    product['dimension34'] = po.dimension34;

    products.push(product);

    this.eecPush('detail', products, null, null);
};

GAHelper.prototype.eecAdd = function(products) {
    this.eecPush('add', products, null, null);
};

GAHelper.prototype.eecRemove = function(products) {
    this.eecPush('remove', products, null, null);
};

GAHelper.prototype.eecCheckout1 = function(products) {
    this.eecPush('checkout1', products, null, null);
};

GAHelper.prototype.eecCheckout2 = function(products, checkout_option) {
    var coo_desc = this.getPaymentTypeName(checkout_option);

    var order = new Object();
    order['checkout_option'] = coo_desc;

    this.eecPush('checkout2', products, order);
};

GAHelper.prototype.eecRefund = function(products, order) {
    gahelper.eecPush('refund', products, order);
};

GAHelper.prototype.eventPush = function(Category, Action, Label) {
    ga('send', 'event', Category, Action, Label);
};

GAHelper.prototype.chkCountry = function() {
    var separator = window.location.pathname.split('/');

    if (separator[0] == "kr") {
        switch (separator[1]) {
            case "ko":
                return "KOR";
            case "en":
                return "USA";
            case "zh":
                return "CHN";
            default:
                break;
        }
    } else {
        return "KOR";
    }
};

GAHelper.prototype.chkLanguage = function() {
    var separator = window.location.pathname.split('/');

    if (separator[0] == "kr") {
        switch (separator[1]) {
            case "ko":
                return "KO";
            case "en":
                return "EN";
            case "zh":
                return "ZH";
            default:
                break;
        }
    } else {
        return "KO";
    }
};

GAHelper.prototype.chkPlatform = function() {
    var filter = "win16|win32|win64|mac|macintel";
    if (navigator.platform) {
        if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
            return "MOBILE";
        } else {
            return "PC";
        }
    }
};

GAHelper.prototype.chkServer = function() {
    var host = window.location.hostname;
    var isDev = host.indexOf("osulloc.com") < 0 &&
        host.indexOf("osulloc.co.kr") < 0 &&
        host.indexOf("10.150.86.207") < 0 &&
        host.indexOf("10.150.86.208") < 0 &&
        host.indexOf("10.150.86.209") < 0 &&
        host.indexOf("220.64.86.123") < 0;

    return isDev;
};

GAHelper.prototype.findProductById = function(id) {
    for (var i = 0; i < this.products.length; i++) {
        if (this.products[i].id == id) {
            return this.products[i];
        }
    }
};

GAHelper.prototype.findProductsByIds = function(ids) {
    var newProducts = new Array();

    for (var i = 0; i < this.products.length; i++) {
        for (var j = 0; j < ids.length; j++) {
            if (this.products[i].id == ids[j]) {
                newProducts.push(this.products[i]);
            }
        }
    }

    return newProducts;
};

GAHelper.prototype.eecPurchase = function(products, order) {
    gahelper.eecPush('purchase', products, order);
};

GAHelper.prototype.getPaymentTypeName = function(checkout_option) {
    var coo_desc = "";
    switch (checkout_option) {
        case "Card":
        case "CARD":
            coo_desc = "신용카드";
            break;
        case "DirectBank":
            coo_desc = "실시간 계좌이체";
            break;
        case "VBank":
            coo_desc = "가상계좌";
            break;
        case "MPoint":
            coo_desc = "현대카드M포인트";
            break;
        case "HPP":
            coo_desc = "휴대폰결제";
            break;
        case "POINT":
            coo_desc = "포인트 전체 결제";
            break;
        case "APCard":
            coo_desc = "아모레퍼시픽 제휴 신용카드";
            break;
        case "KAKAOPAY":
            coo_desc = "카카오페이";
            break;
        case "onlykpay":
            coo_desc = "KPay";
            break;
        case "Fake":
            coo_desc = "테스트결제";
            break;
        case "Freebie":
            coo_desc = "사은품 결제";
            break;
        case "Giftcard":
            coo_desc = "상품권전액결제";
            break;

        default:
            break;
    }

    return coo_desc;
}

// Deprecated
/*
GAHelper.prototype.eecClick = function(id, name, brand, category, position, dimension32, dimension34, product_list) {
    var products = new Array();
    var product = new Object();

    product['id'] = id;
    product['name'] = name;
    product['brand'] = brand;
    product['category'] = category;
    product['position'] = position > 0 ? position : undefined;
    product['dimension32'] = dimension32;
    product['dimension34'] = dimension34 || dimension34 != "" ? dimension34 : undefined;

    products.push(product);

    var order = new Object();

    order['product_list'] = product_list;

    this.eecPush('click', products, order);
}
GAHelper.prototype.eecDetail = function(id, name, brand, category, dimension32, dimension34) {
    var products = new Array();
    var product = new Object();

    product['id'] = id;
    product['name'] = name;
    product['brand'] = brand;
    product['category'] = category;
    product['dimension32'] = dimension32;
    product['dimension34'] = dimension34 || dimension34 != "" ? dimension34 : undefined;

    products.push(product);

    this.eecPush('detail', products, null, null);
}
GAHelper.prototype.eecPurchase = function(products, id, revenue, tax, shipping, coupon, dimension33, dimension56, metric3, metric4, metric5, metric13) {
    var order = new Object();
    order['id'] = id;
    order['revenue'] = revenue;
    order['tax'] = tax;
    order['shipping'] = shipping;
    order['coupon'] = coupon;
    order['dimension33'] = dimension33;
    order['dimension56'] = dimension56;
    order['metric3'] = metric3;
    order['metric4'] = metric4;
    order['metric5'] = metric5;
    order['metric13'] = metric13;

    gahelper.eecPush('purchase', products, null, order);
}
GAHelper.prototype.stackProduct = function(id, name, brand, category, price, quantity, variant, coupon, dimension26, dimension27, dimension30, dimension31, dimension32, dimension34, metric1, metric2, metric4) {
    var product = new Object();

    if (id) product['id'] = id;
    if (name) product['name'] = name;
    if (brand) product['brand'] = brand;
    if (category) product['category'] = category;
    if (price) product['price'] = price;
    if (quantity) product['quantity'] = quantity;
    if (variant) product['variant'] = variant;
    if (coupon) product['coupon'] = coupon;

    if (dimension26) product['dimension26'] = dimension26;
    if (dimension27) product['dimension27'] = dimension27;
    if (dimension30) product['dimension30'] = dimension30;
    if (dimension31) product['dimension31'] = dimension31;
    if (dimension32) product['dimension32'] = dimension32;
    if (dimension34) product['dimension34'] = dimension34;

    if (metric1) product['metric1'] = metric1;
    if (metric2) product['metric2'] = metric2;
    if (metric4) product['metric4'] = metric4;

    this.products.push(product);
}
GAHelper.prototype.showArray = function(varName, arr) {
    var rst = "";
    for (var i = 0; i < arr.length; i++) {
        rst += varName + ("0" + (i + 1)).slice(-2) + " : " + this.dimensions[i], 10;
        if ((i + 1) % 3 == 0) rst += "\n";else rst += "\t\t";
    }
    if (rst.length > 0) this.dlog(rst);else this.dlog(arr.name + ' is empty');
}
GAHelper.prototype.dlog = function(msg) {
    if (this.VIEW_LOG) {
        console.log(msg);
    }
}

*/


