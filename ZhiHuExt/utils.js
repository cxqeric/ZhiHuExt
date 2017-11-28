"use strict"

Array.prototype.addall = function (other)
{
    if ($.isArray(other))
        other.forEach(x => this.push(v));
    else
        console.warn("cannot add non-array to array", other);
}
Array.prototype.flatArray = function ()
{
    return Array.fromArrays(...this);
}
Array.prototype.findInArray = function(array)
{
    if (!(array instanceof Array))
    {
        console.warn("argument is not array", array);
        return;
    }
    const ret = [];
    for (let idx = 0; idx < this.length; ++idx)
    {
        let obj = this[idx];
        if (array.includes(obj))
            ret.push(obj);
    }
    return ret;
}
Array.prototype.last = function ()
{
    return this[this.length - 1];
}
/**
 * @param {string} keyName
 */
Array.prototype.mapToProp = function (keyName)
{
    const ret = [];
    for (let idx = 0; idx < this.length; ++idx)
    {
        ret.push((this[idx])[keyName]);
    }
    return ret;
}
Array.fromArrays = function (...array)
{
    return [].concat.apply([], array);
}
Array.fromArray = function (array)
{
    if (array instanceof Array)
        return Array.fromArrays(...array);
    else
        return [array];
}
Array.prototype.filterUnique = function ()
{
    return Array.from(new Set(this));
}

Set.prototype.intersection = function (other)
{
    const ret = new Set();
    for (const ele of this)
        if (other.has(ele))
            ret.add(ele);
    return ret;
}
Set.prototype.toArray = function ()
{
    return Array.from(this);
}

String.prototype.removeSuffix = function (count)
{
    const del = Math.min(this.length, count);
    return this.substring(0, this.length - del);
}

Math.minmax = (num, min, max) => Math.max(Math.min(num, max), min);


const _DateForamter =
    {
        "M+": /(M+)/,
        "d+": /(d+)/,
        "h+": /(h+)/,
        "m+": /(m+)/,
        "s+": /(s+)/,
        "q+": /(q+)/,
        "S": /(S+)/
    };
Date.prototype.Format = function (fmt)
{ //author: meizz
    const o =
    {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (const k in o)
        if (_DateForamter[k].test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Date.prototype.toUTCSeconds = function ()
{
    return Math.floor(this.getTime() / 1000);
}
Date.fromUTCSeconds = (time) => new Date(time * 1000);

$.prototype.forEach = function (consumer)
{
    this.each((idx, ele) =>
    {
        try
        {
            consumer(ele);
        }
        catch (e) { console.warn(e); }
    });
}

HTMLElement.prototype.hasClass = function (className)
{
    return this.classList.contains(className);
}
HTMLDivElement.prototype.hasChild = function (selector)
{
    if (this.querySelector(selector))
        return true;
    else
        return false;
}
Node.prototype.addClass = function (className)
{
    this.classList.add(className);
}
Node.prototype.addClasses = function (...names)
{
    for (let idx = 0, len = names.length; idx < len; ++idx)
        this.classList.add(names[idx]);
}
Node.prototype.removeClass = function (className)
{
    this.classList.remove(className);
}
Node.prototype.removeClasses = function (...names)
{
    for (let idx = 0, len = names.length; idx < len; ++idx)
        this.classList.remove(names[idx]);
}


/**
 * @template T
 * @typedef {{key: T, count: number}[]} BagArray<T>
 */
/**
 * @template T
 */
class SimpleBag
{
    /**
     * @template T
     * @param {T[] | Set<T>} [arg]
     */
    constructor(arg)
    {
        /**@type {Map<T, number>}*/
        this._map = new Map();
        if (!arg)
            return;
        if (arg instanceof Array)
            this.adds(arg);
        else if (arg instanceof Set)
        {
            for (const ele of arg)
                this._map.set(ele, 1);
        }
    }
    /**
     * @template T
     * @param {...T} elements
     */
    add(...elements)
    {
        if (elements.length === 1)
        {
            const ele = elements[0];
            const old = this._map.get(ele) | 0;
            this._map.set(ele, old + 1);
            return this;
        }
        else
            return this.adds(elements);
    }
    /**
     * @template T
     * @param {T[]} elements
     */
    adds(elements)
    {
        for (let idx = 0; idx < elements.length; ++idx)
        {
            const ele = elements[idx];
            const old = this._map.get(ele) | 0;
            this._map.set(ele, old + 1);
        }
        return this;
    }
    /**
     * @template T
     * @param {T} element
     * @param {number} count
     */
    addMany(element, count)
    {
        const old = this._map.get(element) | 0;
        this._map.set(element, old + count);
        return this;
    }
    /**
     * @template T
     * @param {...T} elements
     */
    remove(...elements)
    {
        if (elements.length === 1)
        {
            const ele = elements[0];
            const old = this._map.get(ele);
            if (old)
            {
                if (old === 1)
                    this._map.delete(ele);
                else
                    this._map.set(ele, old - 1);
            }
            return this;
        }
        return this.removes(elements);
    }
    /**
     * @template T
     * @param {T[]} elements
     */
    removes(elements)
    {
        for (let idx = 0; idx < elements.length; ++idx)
        {
            const ele = elements[idx];
            const old = this._map.get(ele);
            if (old)
            {
                if (old === 1)
                    this._map.delete(ele);
                else
                    this._map.set(ele, old - 1);
            }
        }
        return this;
    }
    /**
     * @template T
     * @param {T} element
     */
    count(element)
    {
        return this._map.get(element) | 0;
    }
    /**
     * @template T
     * @param {...T} elements
     */
    removeAll(...elements)
    {
        for (let idx = 0; idx < elements.length; ++idx)
        {
            const ele = elements[idx];
            this._map.delete(ele);
        }
        return this;
    }
    /**
     * @template T
     * @param {function(T):boolean} [filter]
     */
    elements(filter)
    {
        const keyit = this._map.keys();
        if (filter == null)
            return Array.from(keyit);
        const ret = [];
        while (true)
        {
            const { value, done } = keyit.next();
            if (done) break;
            if (filter(value))
                ret.push(value);
        }
        return ret;
    }
    /**
     * @template T
     * @param {SimpleBag | BagArray} other
     */
    union(other)
    {
        if (other instanceof SimpleBag)
            for (const ele of other._map)
                this.addMany(ele[0], ele[1]);
        else
            for (let i = 0; i < other.length; ++i)
                this.addMany(other[i].key, other[i].count);
        return this;
    }
    /**
     * @template T
     * @param {function(T, number): boolean} filtor
     */
    filter(filtor)
    {
        const newbag = new SimpleBag();
        const themap = newbag._map;
        for (const ele of this._map)
            if (filtor(ele[0], ele[1]))
                themap.set(ele[0], ele[1]);
        return newbag;
    }
    /** @param {number} maxcount*/
    below(maxcount)
    {
        const newbag = new SimpleBag();
        const themap = newbag._map;
        for (const ele of this._map)
            if (ele[1] < maxcount)
                themap.set(ele[0], ele[1]);
        return newbag;
    }
    /** @param {number} mincount*/
    above(mincount)
    {
        const newbag = new SimpleBag();
        const themap = newbag._map;
        for (const ele of this._map)
            if (ele[1] > mincount)
                themap.set(ele[0], ele[1]);
        return newbag;
    }
    /**
     * @template T
     * @param {function(T, number):void} callback
     */
    forEach(callback)
    {
        for (const ele of this._map)
            callback(ele[0], ele[1]);
    }
    /**
     * @template T
     * @template R
     * @param {function(T, number):R} callback
     */
    map(callback)
    {
        const ret = [];
        for (const ele of this._map)
            ret.push(callback(ele[0], ele[1]));
        return ret;
    }
    toMap() { return new Map(this._map); }
    toSet() { return new Set(this._map.keys()); }
    /**
     * @param {"desc" | "asc"} [config]
     * @returns {BagArray<T>}
     */
    toArray(config)
    {
        const array = [];
        for (const ele of this._map)
            array.push({ "key": ele[0], "count": ele[1] });
        if (config === "desc")
            return array.sort((x, y) => y.count - x.count);
        else if (config === "asc")
            return array.sort((x, y) => x.count - y.count);
        return array;
    }
    get size() { return this._map.size; }
    /**
     * @template T
     * @param {BagArray} bagArray
     * @returns {SimpleBag<T>}
     */
    static fromBagArray(bagArray)
    {
        const bag = new SimpleBag();
        for (let i = 0; i < bagArray.length; ++i)
            bag._map.set(bagArray[i].key, bagArray[i].count);
        return bag;
    }
    /**
     * @template T
     * @param {BagArray} bagArray
     * @returns {Map<T, number>}
     */
    static backToMap(bagArray)
    {
        const themap = new Map();
        for (let i = 0; i < bagArray.length; ++i)
            themap.set(bagArray[i].key, bagArray[i].count);
        return themap;
    }
}


/**
 * @template T
 * @param {...T} arg
 */
function _any(...arg)
{
    for (let i = 0; i < arg.length; ++i)
        if (arg[i] != null)
            return arg[i];
    return arg[arg.length - 1];
}

/**@description parse query string to key-value object
 * @param {string} [qurl] URL's query string
 * @returns {{[x:string]: string}} key-value object
 */
function _getQueryString(qurl)
{
    if (!qurl)
    {
        const url = window.location.href;
        const idx = url.indexOf("?") + 1;
        qurl = idx > 0 ? url.substring(idx) : "";
    }
    const querys = qurl.split("&");
    var ret = {};
    for (var i = 0; i < querys.length; ++i)
    {
        var p = querys[i].split('=');
        if (p.length != 2) continue;
        ret[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return ret;
};
/**
 * @param {number} ms
 */
function _sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * @param {number} timestamp
 * @param {string} [defVal]
 */
function timeString(timestamp, defVal)
{
    if (timestamp < 0) return defVal;
    return Date.fromUTCSeconds(timestamp).toLocaleString(undefined, { hour12: false });
}
/**
 * @template T
 * @param {T[]} array
 * @param {Set<T>} set
 * @returns {[T[], T[]]} [inside,outside]
 */
function splitInOutSide(array, set)
{
    if (!(array instanceof Array) || !(set instanceof Set))
    {
        console.warn("argument wrong", array, set);
        return;
    }
    const inside = [], outside = [];
    for (let idx = 0; idx < array.length; ++idx)
    {
        const obj = array[idx];
        if (set.has(obj))
            inside.push(obj);
        else
            outside.push(obj);
    }
    return [inside, outside];
}
/**
 * @param {number} red
 * @param {number} green
 * @param {number} blue
 */
function formColor(red, green, blue)
{
    const sred = red.toString(16), sgreen = green.toString(16), sblue = blue.toString(16);
    if (sred.length < 2) sred = "0" + sred;
    if (sgreen.length < 2) sgreen = "0" + sgreen;
    if (sblue.length < 2) sblue = "0" + sblue;
    return "#" + sred + sgreen + sblue;
}
/**
 * @param {string[]} extraClass
 * @param {string} [text]
 */
function createButton(extraClass, text)
{
    const btn = document.createElement("button");
    btn.addClass("Button");
    btn.addClasses(...extraClass);
    btn.setAttribute("type", "button");
    if(text)
        btn.innerText = text;
    return btn;
}
/**
 * @param {number} width
 * @param {number} height
 * @param {string} viewbox
 * @param {string[]} path
 */
function createSVG(width, height, viewbox, ...path)
{
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const pathstrs = path.map(x => `<path d="${x}"></path>`).join("");
    svg.innerHTML = pathstrs;
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.setAttribute("viewBox", viewbox)
    return svg;
}

async function SendMsgAsync(data)
{
    const pms = $.Deferred();
    chrome.runtime.sendMessage(data, ret => pms.resolve(ret));
    return pms;
}


/**
 * @param {Promise<Any> | Set<Any> | SimpleBag | Any[]} dat
 * @returns {Promise<Any[]>}
 */
async function toPureArray(dat)
{
    const dat0 = dat instanceof Promise ? await dat : dat;
    const dat1 = dat0 instanceof Set ? dat0.toArray() : dat0;
    const dat2 = dat1 instanceof SimpleBag ? dat1.toArray() : dat1;
    if (dat2 == null)
        return [];
    const dat3 = dat2 instanceof Array ? dat2 : [dat2];
    if (dat3.length === 0)
        return [];
    const dat4 = dat3[0].hasOwnProperty("count") ? dat3.mapToProp("key") : dat3;
    return dat4;
}
/**
 * @template T
 * @param {Promise<T> | SimpleBag | T[]} dat
 * @returns {Promise<BagArray[]>}
 */
async function toSimpleBagArray(dat)
{
    const dat0 = dat instanceof Promise ? await dat : dat;
    const dat1 = dat0 instanceof SimpleBag ? dat0.toArray() : dat0;
    const dat2 = dat1 instanceof Array ? dat1 : [dat1];
    const dat3 = dat2[0].hasOwnProperty("count") ? dat3 : dat3.map(x => ({ key: x, count: 1 }));
    return dat3;
}