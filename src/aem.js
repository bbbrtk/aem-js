"use strict";
const fs = require('fs');
const _ = require("lodash");
const path = 'data/';

export const vertexSimilarity = function(arr1, arr2){
    let similarity = 0;
    arr1.forEach(element => {
        if (arr2.includes(element)) similarity++;
    });
    return similarity;
}

export const edgeArray = function(arr1){
    let edges = [];
    arr1.forEach((elem, index) => {
        if (index == arr1.length-1) index = -1;
        edges.push(
            new Set([elem, arr1[index+1]])
            )
    });
    return edges;
}

export const edgeSimilarity = function(arr1, arr2){
    let similarity = 0;
    arr1.forEach(elem1 => {
        arr2.forEach(elem2 => {
            if (_.isEqual(elem1, elem2)) similarity++;
        });
    });
    return similarity;
}

export const loadData = function(filename){
    if (fs.lstatSync(filename).isFile()) {
        return fs.readFileSync(filename, 'utf-8');
    }
}

export const toArray = function(filename){
    let buffer = loadData(filename);
    return [...buffer];
}

function convertBufferToNumberArray(content){
    let number = '';
    let arr = [];
    content.forEach(element => {
        if (element == '\n') {
            arr.push(parseInt(number, 10)); 
            number = '';
        }
        else number += element;
    });
    return arr;
}

function convertBufferToAnArray(content){
    let number = '';
    let mainArr = [];
    let arr = [];
    content.forEach(element => {
        if (!isNaN(parseInt(element))){
            number += element;
        } else {
            if (element == ',') {
                arr.push(parseInt(number, 10)); 
                number = '';
            }
            if (element == '\n') {
                mainArr.push(arr); 
                arr = [];
            }
        }
    });
    return mainArr;
}

export const loadAllFiles = function(){
    let arr = [];
    const lens = [
        'lensA.txt',
        'lensB.txt'
    ];
    const paths = [
        'pathsA.txt',
        'pathsB.txt'
    ];
    lens.forEach(element => {
        let content = toArray(path + element);
        arr.push(convertBufferToNumberArray(content));
    });
    paths.forEach(element => {
        let content = toArray(path + element);
        arr.push(convertBufferToAnArray(content));
    });
    return arr;
}

export const findMaxAvg = function(arr){
    let avg = _.reduce(arr, (sum, elem) => {return sum + elem}, 0) / arr.length;
    let max = Math.max(...arr);
    return [max, avg];
}