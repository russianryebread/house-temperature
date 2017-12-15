var app = new Vue({
    el: '#app',
    data: {
        temp: {}
    },
    mounted: function() {
        this.getData()
    },
    methods: {
        percentageToHsl: function(percentage, hue0, hue1) {
            var hue = (percentage * (hue1 - hue0)) + hue0;
            return 'hsl(' + hue + ', 70%, 50%)';
        },
        normalize: function(val, max, min) {
            return (val - min) / (max - min)
        },
        getData() {
            var self = this
            var url = 'https://tenable-goldfish-6761.dataplicity.io/api'
            axios.get(url).then(function (response) {
                console.log(response)
                self.temp = response.data
                setTimeout(self.getData, 15000)
            }).catch(function (error) {
                console.log(error)
            });
        }
    },
    computed: {
        bgcolor: function() {
            var n = this.normalize(this.temp.f, 100, 20)
            return 'background-color: ' + this.percentageToHsl(n, 240, 37)
        }
    }
})