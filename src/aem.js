"use strict";
const fs = require('fs');
const _ = require("lodash");
const path = 'data/';

 const vertexSimilarity = function(arr1, arr2){
    let similarity = 0;
    arr1.forEach(element => {
        if (arr2.includes(element)) similarity++;
    });
    return similarity;
}

 const edgeArray = function(arr1){
    let edges = [];
    arr1.forEach((elem, index) => {
        if (index == arr1.length-1) index = -1;
        edges.push(
            new Set([elem, arr1[index+1]])
            )
    });
    return edges;
}

 const edgeSimilarity = function(arr1, arr2){
    let similarity = 0;
    arr1.forEach(elem1 => {
        arr2.forEach(elem2 => {
            if (_.isEqual(elem1, elem2)) similarity++;
        });
    });
    return similarity;
}

 const loadData = function(filename){
    if (fs.lstatSync(filename).isFile()) {
        return fs.readFileSync(filename, 'utf-8');
    }
}

 const toArray = function(filename){
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

 const loadAllFiles = function(){
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

 const findMaxAvg = function(arr){
    let avg = _.reduce(arr, (sum, elem) => {return sum + elem}, 0) / arr.length;
    let max = Math.max(...arr);
    return [max, avg];
}

 const calcAvgSimilarityToAll = function(values, paths, func){
    let similarities = []

    paths.forEach((elem1, index) => {
        let similarity = -paths.length; // to not include similarity with itself when calculating avg
        paths.forEach(elem2 => {
            similarity += func(elem1, elem2);
        });
        similarities.push({
            'value' : values[index], 
            'similarity' : similarity/(paths.length-1)
        });
    });
    return similarities;
}

 const calcSimilarityToBest = function(values, paths, func, best){
    let similarities = []

    paths.forEach((elem1, index) => {
        similarities.push({
            'value' : values[index], 
            'similarity' : func(elem1, best)
        });
    });
    return similarities;
}

 const calcAllSimilarities = function(values, paths, best){
    let vertexSim = calcAvgSimilarityToAll(values, paths, vertexSimilarity);
    let vertexSimBest = calcSimilarityToBest(values, paths, vertexSimilarity, best);
    let edges = [];
    paths.forEach(elem1 => {
        edges.push(edgeArray(elem1));
    });   
    let edgeSim = calcAvgSimilarityToAll(values, edges, edgeSimilarity);
    let edgeSimBest = calcSimilarityToBest(values, edges, edgeSimilarity, edgeArray(best));

    return [vertexSim, vertexSimBest, edgeSim, edgeSimBest];
}

let arr = loadAllFiles();
let best = [];
let abc = calcAvgSimilarityToAll(arr[0], arr[2], edgeSimilarity, arr[2][10]);
// let [vertexSim, vertexSimBest, edgeSim, edgeSimBest] = calcAllSimilarities(arr[0], arr[2], best);
console.log(abc);
console.log("vertexSimBest");

abc.sort(function(a, b){
    return a.value > b.value;
  });

console.log(abc)