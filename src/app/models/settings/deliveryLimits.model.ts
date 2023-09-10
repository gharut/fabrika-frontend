export class DeliveryLimits {
  id?: number;
  category?: string;
  name?: string;
  value?: string

  constructor(id: number, cat: string, name: string, value: string) {
    this.id = id
    this.category = cat
    this.name = name
    this.value = value
  }

  getValue() {
    if(this.value != "") {
      return JSON.parse(this.value!)
    }else{
      return null
    }
  }

  getVolumes() {
    let value = this.getValue()
    if(value != null) {
      return value.volume
    }else{
      return null
    }
  }

  getVolumeBase() {
    let value = this.getValue()
    console.log(value)
    if(value != null) {
      return parseInt(value.volume_base)
    }else{
      return 0
    }
  }

  getWeightBase() {
    let value = this.getValue()
    if(value != null) {
      return parseInt(value.weight_base)
    }else{
      return 0
    }
  }

  getWeights() {
    let value = this.getValue()
    if(value != null) {
      return value.weight
    }else{
      return null
    }
  }

  getVolumeTotalPrice(vol: number): number {
    let vol_limits = this.getVolumes()
    let over_volume = vol - this.getVolumeBase()
    if(over_volume < 0) {
      return 0
    }
    let price = 0
    if(vol_limits != null) {
      vol_limits.forEach((limit: {min: number, max: number, price: number}) => {
        if(over_volume >= limit.min) {
          if(limit.max === null || over_volume <= limit.max){
            price = limit.price
            return
          }
        }
      })
    }

    return price*over_volume
  }

  getWeightTotalPrice(weight: number): number {
    let weight_limits = this.getVolumes()
    let over_weight = weight - this.getWeightBase()
    if(over_weight < 0) {
      return 0
    }
    let price = 0
    if(weight_limits != null) {
      weight_limits.forEach((limit: {min: number, max: number, price: number}) => {
        if(weight >= limit.min) {
          if(limit.max != undefined && weight <= limit.max){
            price = limit.price
          }
        }
      })
    }

    return price*over_weight
  }
}
