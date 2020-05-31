import { vertexSimilarity, edgeArray, loadData, toArray, loadAllFiles } from "./aem";
import { expect } from 'chai';

describe('Check how many same vertexes are in both solutions', () => {
    const arr1 = [1,2,3,4,5]
    const arr2 = [1,7,8,3]

    it('Both arrays are empty', () => {
        const expected = 0;
        const actual = vertexSimilarity([],[]);
        expect(actual).to.equal(expected);
    });
    it('First array is empty', () => {
        const expected = 0;
        const actual = vertexSimilarity([],arr1);
        expect(actual).to.equal(expected);
    });
    it('Second array is empty', () => {
        const expected = 0;
        const actual = vertexSimilarity(arr1,[]);
        expect(actual).to.equal(expected);
    });

    it('Different arrays with few same elements', () => {
        const expected = 2;
        const actual = vertexSimilarity(arr1,arr2);
        expect(actual).to.equal(expected);
    });
    it('In opposite - different arrays with few same elements', () => {
        const expected = 2;
        const actual = vertexSimilarity(arr2,arr1);
        expect(actual).to.equal(expected);
    });
    it('Same arrays with same elements', () => {
        const expected = arr1.length;
        const actual = vertexSimilarity(arr1,arr1);
        expect(actual).to.equal(expected);
    });
});

describe('Create edges array from vertex array', () => {

    it('Empty vertex array', () => {
        const expected = [];
        const actual = edgeArray([]);
        expect(actual).to.deep.equal(expected);
    });
    it('Check if elem of array is set', () => {
        const arr1 = [1,2,3];
        const actual = edgeArray(arr1);
        expect(actual[0] instanceof Set).to.be.true;
    });
    it('Short vertex array', () => {
        const arr1 = [1,2,3];
        const expected = [new Set([1,2]),new Set([2,3]), new Set([3,1])];
        const actual = edgeArray(arr1);
        expect(actual).to.deep.equal(expected);
    });
    it('Long vertex array', () => {
        const arr1 = [1,2,3,7,8];
        const expected = [new Set([1,2]),new Set([2,3]), new Set([3,7]), new Set([7,8]), new Set([8,1])];
        const actual = edgeArray(arr1);
        expect(actual).to.deep.equal(expected);
    });
});

describe('Check if data from file is loaded properly', () => {
    const path = 'data/test.txt';
    it('Check if there is a file under this path', () => {
        const actual = loadData(path);
        expect(actual).to.exist;
    });
    it('Check if data is returned', () => {
        const actual = toArray(path);
        expect(actual).to.be.an('array');
    });
    it('Check if data is not empty', () => {
        const actual = toArray(path);
        expect(actual.length).to.not.equal(0);
    });
});

describe('Load all data from files', () => {
    it('Check if loaded arrays have proper length', () => {
        const actual = loadAllFiles();
        actual.forEach(element => {
            expect(element.length).to.equal(1000);
        });
    });
    it('Check if lens.txt elements are numbers', () => {
        const actual = loadAllFiles();
        expect(actual[0][0]).to.be.a('number');
    });
    it('Check if path.txt elements are arrays', () => {
        const actual = loadAllFiles();
        expect(actual[2][0]).to.be.an('array');
    });
});