const Corestore = require('corestore')
const Autopass = require('autopass')
const path = require('bare-path')
const dir = require('bare-storage')
const FramedStream = require('framed-stream')
const storagePath = path.join(dir.persistent(), 'managed-security-portal', 'corestore')

async function initialize() {
  const store = new Corestore(storagePath)
  const pass = new Autopass(store)

  await pass.ready()
  const pipe = new FramedStream(Bare.IPC)
  pipe.write('autopass-ready')

  pipe.on('data', async (data) => {
    let message
    try {
      const b4a = require('b4a')
      const text = b4a.toString(data, 'utf8')
      message = JSON.parse(text)

      if (message.action === 'add') {
        await pass.add(message.key, message.value)
        pipe.write(
          JSON.stringify({
            action: 'add',
            success: true,
            requestId: message.requestId
          })
        )
      }
      if (message.action === 'list') {
        const records = await pass.list().toArray()
        pipe.write(
          JSON.stringify({
            action: 'list',
            success: true,
            requestId: message.requestId,
            records: records
          })
        )
      }
      if (message.action === 'remove') {
        await pass.remove(message.key)
        pipe.write(
          JSON.stringify({
            action: 'remove',
            success: true,
            requestId: message.requestId
          })
        )
      }
    } catch (error) {
      pipe.write(
        JSON.stringify({
          action: message?.action || 'error',
          success: false,
          requestId: message?.requestId,
          error: error.message || 'Request Failed'
        })
      )
    }
  })
}

initialize().catch(console.error)
