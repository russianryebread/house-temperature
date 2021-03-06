var app = new Vue({
    el: '#app',
    data: {
        temp: {},
        plug: {},
        error: null,
        //url: 'http://207.190.84.164',
        url: 'https://unconscious-orang-utan-3108.dataplicity.io'
    },
    mounted: function () {
        this.getData()
    },
    methods: {
        percentageToHsl: function (percentage, hue0, hue1, saturation = 70, lightness = 50) {
            var hue = this.niceNumbers((percentage * (hue1 - hue0)) + hue0)
            return 'hsl(' + hue + ', ' + saturation + '%, ' + lightness + '%)';
        },
        normalize: function (val, max, min) {
            return (val - min) / (max - min)
        },
        niceNumbers: function(val) {
            return (val * 1e2) / 1e2
        },
        getData() {
            var self = this
            var url = this.url + '/api'
            axios.get(url).then(function (response) {
                self.error = null
                self.temp = response.data
                setTimeout(self.getData, 15000)
            }).catch(function (error) {
                console.error(error)
                self.error = "Error Returning Temperature :("
                self.temp.f = null
                setTimeout(self.getData, 15000)
            })

            var plug_url = this.url + '/api/plug/192.168.1.91'
            axios.get(plug_url).then(function (response) {
                self.error = null
                self.plug = response.data.device
            }).catch(function (error) {
                console.error(error)
            })
        }
    },
    computed: {
        bgcolor: function () {
            if(!this.temp.f) return 'background: linear-gradient(rgb(189, 38, 217), rgb(95, 19, 108));'
            var n = this.normalize(this.temp.f, 100, 20)
            return `background: linear-gradient(${this.percentageToHsl(n, 240, 37)}, ${this.percentageToHsl(n, 240, 37, 70, 25)})`
        },
        historicTemps() {
            var h = this.temp.history
            var ht = []
            for(var t in h) {
                var n = this.niceNumbers(Math.round(parseFloat(h[t].temp)))
                ht.push(n)
            }
            return ht.reverse()
        },
        highLow() {
            let min = Number.POSITIVE_INFINITY
            let max = Number.NEGATIVE_INFINITY

            if(!this.temp.history) return {}

            for (const v of this.temp.history) {
                min = Math.min(min, v.temp)
                max = Math.max(max, v.temp)
            }

            return { min: min.toFixed(1), max: max.toFixed(1) }
        },
        plugState() {
            return (this.plug.relay_state) ? 'online' : 'offline'
        }
    }
})
