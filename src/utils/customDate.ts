class CustomDate {
    static month = ["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря"]
    
    static getMonth(number:number) {
        return this.month[number]
    }
}


export default CustomDate