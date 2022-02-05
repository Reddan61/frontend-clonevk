class CustomDate {
    static month = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
    
    static getMonth(number:number) {
        return this.month[number]
    }
}


export default CustomDate