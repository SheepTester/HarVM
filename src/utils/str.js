/*
* @Author: UnsignedByte
* @Date:   00:35:20, 25-May-2020
* @Last Modified by:   UnsignedByte
* @Last Modified time: 00:36:36, 25-May-2020
*/

function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export { escapeRegex }