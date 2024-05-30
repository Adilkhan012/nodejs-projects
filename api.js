// dependencies
const fs = require('fs')
const express = require('express')
const router = express.Router()

const { getContractNft } = require('./smart-contracts-config')
const { addTextWatermark } = require('./watermark')

router.get('/', async (req, res) => {
  res.send({ message: 'Assalamo Alaikum' })
})

router.get('/metadata/:tokenId', async (req, res) => {
  try {
    const tokenId = Number(req.params.tokenId)
    const domainName = await getContractNft()
      .methods.domainNameOf(tokenId)
      .call()
    const metadata = {
      name: domainName,
      image: `https://js-code-lab-1-production.up.railway.app/api/images/${domainName}`,
    }
    res.send(metadata)
  } catch (error) {
    res.send({})
    return
  }
})

router.get('/images/:domainName', async (req, res) => {
  const dstPath = 'watermark.jpg'
  const options = {
    text: `@${req.params.domainName}.Litfam`,
    dstPath,
  }
  await addTextWatermark('LITFAM.jpeg', options, () => {
    res.sendFile(__dirname + '/' + dstPath)
  })
})

module.exports = router
