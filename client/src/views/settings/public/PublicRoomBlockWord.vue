
<template>
    <!-- 욕설필터

// 욕설 사전을 배열로 정의합니다.
const badWordsArray = ["욕설1", "욕설2", "욕설3"];

// 텍스트에서 욕설을 찾아내는 함수를 만듭니다.
function findBadWords(text) {
  const foundBadWords = [];

  // 욕설 사전 배열을 순회하면서 욕설을 검사합니다.
  for (const badWord of badWordsArray) {
    const regex = new RegExp(`\\b${badWord}\\b`, 'gi'); // 정규 표현식을 사용해 단어 단위로 검사
    const matches = text.match(regex);

    if (matches) {
      foundBadWords.push(...matches);
    }
  }

  return foundBadWords;
}

// 예시 텍스트에서 욕설을 찾아냅니다.
const sampleText = "이 글에는 욕설1과 욕설2가 포함되어 있습니다. 욕설3도 있을지도 모릅니다.";
const badWordsFound = findBadWords(sampleText);

if (badWordsFound.length > 0) {
  console.log("다음 욕설이 발견되었습니다:", badWordsFound);
} else {
  console.log("욕설이 발견되지 않았습니다.");
}


 -->

    <div class="app-wrapper">
        <div class="sub-container">
            <div>
                <top-navigation-bar />
            </div>
            <div class="app-main">
                <div class="w-100 px-4">
                    <div class="d-flex pt-4">
                        <div class="search-bar__box blur-box-color">
                            <input
                                type="text"
                                ref="blockWordInput"
                                class="search-bar__input w-100 fs-18"
                                v-model="currentBlockWord"
                                @keydown.enter.prevent="addBlockWord"
                                placeholder="입력"
                            />
                        </div>
                        <div class="d-flex ps-2 align-items-center" @click="addBlockWord">
                            <base-icon :icon="'plus'" :fontSize="'20px'" :color="'#fff'" class="icon-clear"/>
                        </div>
                    </div>

                    <div class="blur-color text-start pt-1 pb-1 fs-14">{{ blockWords.length }}/20</div>
                    <div class="d-flex flex-wrap pt-2">
                        <div
                            v-for="(word, index) in blockWords"
                            :key="index"
                            class="me-2 mt-2 pt-1 rounded-5 pb-1 px-3 message-box-color grey3 text-truncate"
                            @click="deleteBlockWord(word.id)"
                        >
                            {{ word.name }}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <bottom-navigation-bar />
            </div>
        </div>
    </div>
</template>
  
<script>
import TopNavigationBar from '@/layout/components/TopNavigationBar';
import BottomNavigationBar from '@/layout/components/BottomNavigationBar';
import BaseIcon from '@/components/BaseIcon';

import { mapGetters } from 'vuex';


export default {
    name: 'PublicRoomBlockWord',
    components: {
        TopNavigationBar,
        BottomNavigationBar,
        BaseIcon,
        // SearchFriends,
    },
    computed: {
        ...mapGetters(['publicInfo', 'blockWords']),
    },
    data() {
        return {
            currentBlockWord: '',
        };
    },
    created() {
        this.$store.dispatch('getBlockWords');
    },
    methods: {
        isOpendKeyboardBox() {
            if (document.documentElement.clientHeight !== window.visualViewport.height) return true;
            return false;
        },
        addBlockWord() {
            if (this.currentBlockWord.replace(/ /g, '').replace(/(?:\r\n|\r|\n)/g, '') === '') return;
            if (event.isComposing || event.keyCode === 229) return;
            if (this.blockWords.length > 19) {
                this.$store.commit('setToastMessage', '금지 단어는 최대 20개까지만 가능합니다.');
                this.$store.commit('showToast');
                this.currentBlockWord = '';
                return;
            }

            this.$store.dispatch('addBlockWords', this.currentBlockWord);
            this.currentBlockWord = '';
            this.$refs.blockWordInput.focus();
        },
        deleteBlockWord(index) {
            this.$store.dispatch('deleteBlockWords', index);

            if (this.isOpendKeyboardBox) {
                this.$refs.blockWordInput.focus();
            }
        },
    },
};
</script>
  
<style scoped>
.search-bar__box {
    padding: 0;
    border-bottom: 1px solid #b6b6b6;
    background-color: #fff;
}

.icon-clear {
    padding: 5px;
    border-radius: 50%;
    background-color: #6690ff;
    color: #fff;
}
</style>
    