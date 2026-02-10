import { createOfflineDocument } from "@audiotool/nexus"

{
  // offline document that is validated
  const nexus = await createOfflineDocument({ validated: true })

  nexus.events.onCreate("tinyGain", () => {
    console.debug("tinyGain created")
  })

  await nexus.modify((t) => {
    const tm = t.create("tinyGain", {})
    let haveThrown = false
    try {
      t.update(tm.fields.gain, 111.3)
    } catch (e) {
      haveThrown = true
    }
    if (!haveThrown) {
      throw new Error("should have thrown")
    }
  })
}

{
  const nexus = await createOfflineDocument({ validated: false })

  nexus.events.onCreate("tinyGain", () => {
    console.debug("tinyGain created")
  })

  await nexus.modify((t) => {
    const tm = t.create("tinyGain", {})
    // this should not throw
    t.update(tm.fields.gain, 1111.3)
  })
}
