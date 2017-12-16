var app = new Vue({
    el: '#app',
    data: {
        temp: {}
    },
    mounted: function () {
        this.getData()
    },
    methods: {
        percentageToHsl: function (percentage, hue0, hue1) {
            var hue = this.niceNumbers((percentage * (hue1 - hue0)) + hue0)
            return 'hsl(' + hue + ', 70%, 50%)';
        },
        normalize: function (val, max, min) {
            return (val - min) / (max - min)
        },
        niceNumbers: function(val) {
            return (val * 1e2) / 1e2
        },
        getData() {
            var self = this
            var url = 'https://tenable-goldfish-6761.dataplicity.io/api'
            axios.get(url).then(function (response) {
                self.temp = response.data
                setTimeout(self.getData, 15000)
            }).catch(function (error) {
                console.error(error)
            });
        }
    },
    computed: {
        bgcolor: function () {
            var n = this.normalize(this.temp.f, 100, 20)
            return 'background-color: ' + this.percentageToHsl(n, 240, 37)
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
        }
    }
})