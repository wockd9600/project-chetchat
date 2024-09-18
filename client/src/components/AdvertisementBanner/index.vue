<template>
    <div class="ad">
        <a :href="`https://${u}`">
            <img v-if="ad" :src="ad" alt="광고" />
        </a>
    </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
    name: 'AdvertisementBanner',
    data() {
        return {
            ad: null,
            u: null,
        };
    },
    async created() {
        try {
            const ads = sessionStorage.getItem('ad');

            if (ads) {
                const { ad, u } = JSON.parse(ads);
                this.ad = ad;
                this.u = u;
            } else {
                const response = await axios.get('/ad');

                if (response.status === 200 && response.data.ad) {
                    this.ad = response.data.ad;
                    this.u = response.data.u;
                    sessionStorage.setItem('ad', JSON.stringify({ ad: this.ad, u: this.u }));
                } else {
                    sessionStorage.setItem('ad', JSON.stringify({ ad: null, u: null }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
};
</script>

<style>
.ad {
    width: 100%;
    min-height: 50px;
    background-color: #f0f0f0;
}

.ad img {
    width: 100%;
    max-height: 100px;
    object-fit: cover;
}
</style>