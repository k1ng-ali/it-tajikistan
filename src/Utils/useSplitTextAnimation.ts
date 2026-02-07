import { onMounted } from 'vue'
import { createTimeline, stagger, splitText } from 'animejs'

interface SplitTextOptions {
    words?: boolean
    chars?: boolean
    duration?: number
    wordStagger?: number
    charStagger?: number
}

export function useSplitTextAnimation(
    target: () => HTMLElement | null,
    options: SplitTextOptions = {}
) {
    onMounted(() => {
        const el = target()
        if (!el) return

        const {
            words = true,
            chars = false,
            duration = 650,
            wordStagger = 120,
            charStagger = 10
        } = options

        const split = splitText(el, {
            words: words ? { wrap: 'clip' } : false,
            chars
        })

        const tl = createTimeline({
            defaults: {
                duration,
                ease: 'inOut(3)'
            }
        })

        if (split.words) {
            tl.add(
                split.words,
                { y: ['100%', '0%'] },
                stagger(wordStagger)
            )
        }

        if (split.chars) {
            tl.add(
                split.chars,
                { y: ['100%', '0%'] },
                stagger(charStagger, { from: 'random' })
            )
        }

        tl.init()
    })
}
