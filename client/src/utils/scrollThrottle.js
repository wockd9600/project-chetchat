const toFit = async (
    cb,
    { dismissCondition = () => false, triggerCondition = () => true }
) => {
    if (!cb) {
        throw Error('Invalid required arguments')
    }

    let tick = false

    return function (e) {
        // console.log('scroll call')

        if (tick) {
            return
        }

        tick = true
        return requestAnimationFrame(() => {
            if (dismissCondition()) {
                tick = false
                return
            }

            if (triggerCondition()) {
                // console.log('real call')
                tick = false
                return cb(e)
            }
        })
    }
}

export {
    toFit
}