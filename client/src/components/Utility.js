/* Utility functions defined globally */

const normalizeRange = (score, oldRange, newRange) => {
    // Define old range attributes
    let oldRangeMin = Math.min(...oldRange);
    let oldRangeMax = Math.max(...oldRange);
    let oldRangeValue = oldRangeMax - oldRangeMin;
    // Define new range attributes
    let newRangeMin = Math.min(...newRange);
    let newRangeMax = Math.max(...newRange)
    let newRangeValue = newRangeMax - newRangeMin;
    return (((score - oldRangeMin) * newRangeValue) / oldRangeValue) + newRangeMin;
}

export {normalizeRange};