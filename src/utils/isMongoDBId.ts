export function isMongoDBId(id:string) {
    const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')
    
    return checkForHexRegExp.test(id)
}