const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

let sede;

const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])



const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
    [
        '🚀 Puedes aportar tu granito de arena a este proyecto',
        '[*opencollective*] https://opencollective.com/bot-whatsapp',
        '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
        '[*patreon*] https://www.patreon.com/leifermendez',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)


const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
    [
        '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
        'https://bot-whatsapp.netlify.app/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario]
)

const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
    [
        '🙌 Aquí encontras un ejemplo rapido',
        'https://bot-whatsapp.netlify.app/docs/example/',
        '\n*2* Para siguiente paso.',
    ],
    null,
    null,
    [flowSecundario, flowGracias]
)

// const flowDiscord = addKeyword(['2']).addAnswer(
//     [
//         '¡Bienvenido de nuevo, FlikFlaker! 🌟',
//         'Dinos a qué sede de Flik-Flak perteneces (Poblado, Palmas o Estadio).',
//         'En cualquier momento, si deseas contactar con un asesor, simplemente escribe *asesor* y serás redirigido automáticamente.',
//     ],
//     {capture:true},
//      async (ctx
//         ) => {
//         console.log(ctx)
//         sede = ctx.body;
//         return flowDynamic(`Encantado *${sede}*, continuamos...`)
//     },

//     [flowSecundario]
// )


const flowDiscord = addKeyword(['1']).addAnswer(
    [
        '¡Bienvenido de nuevo, FlikFlaker! 🌟',
        'Dinos a qué sede de Flik-Flak perteneces (Poblado, Palmas o Estadio).',
        'En cualquier momento, si deseas contactar con un asesor, simplemente escribe *asesor* y serás redirigido automáticamente.',
    ],
    { capture: true},

    async (ctx, { flowSecundario, endFlow }) => {
        console.log(ctx);
        if (ctx.body == '❌ Cancelar solicitud') {
            return endFlow({
                body: '❌ Su solicitud ha sido cancelada ❌'
            });
        }
        sede = ctx.body;
        return  await flowSecundario;
                // Puedes continuar con el flujo aquí según sea necesario.
        // Por ejemplo, puedes usar el valor capturado en ctx.body (sede) para personalizar más el flujo.
    },
    [flowSecundario]
).addAnswer(
    [
        '¡FlikFlaker! 🌟',
        'Eres Elite o entrenas una sola vez a la semana?',
        'Responde Elite o amateur',
    ],
    { capture: true},

    async (ctx, { flowSecundario, endFlow }) => {
        console.log(ctx)
        if (ctx.body == '❌ Cancelar solicitud') {
            return endFlow({
                body: '❌ Su solicitud ha sido cancelada ❌'
            });
        }
        sede = ctx.body;
        return  await flowSecundario;
                // Puedes continuar con el flujo aquí según sea necesario.
        // Por ejemplo, puedes usar el valor capturado en ctx.body (sede) para personalizar más el flujo.
    },
    [flowSecundario]
)


const flowPrincipal = addKeyword(['hola', 'ole', 'alo','buenas'])
.addAnswer('🙌 ¡Hola FlikFlaker! Bienvenido/a a un mundo lleno de piruetas con *Flik-Flak*. Soy tu asistente virtual, *FlikFlakBot*.')
.addAnswer(
    [
        'Explora las emocionantes opciones que tenemos para ti. ¿Listo/a para sumergirte en el fascinante universo de la gimnasia artística? 🌍',
        '',
        '**Menú:**',
        '1. 🌐 Identificar si ya eres cliente Accede a tu cuenta y descubre promociones exclusivas.',
        '   - Realiza trámites de pagos de mensualidades de manera rápida y sencilla.',
        '2. 👋 Nuevo FlikFlaker: ¡Bienvenido/a al equipo! Explora las opciones para empezar tu viaje con *Flik-Flak*.',
        '3. 📋 Pólizas: Conoce nuestras políticas y términos.',
        '0. ☎️ Contactar un asesor: Deja tu número y uno de nuestros asesores se comunicará contigo para ofrecerte la mejor asesoría de una manera ¡divertida y personalizada!',
        '',
        '¡Comencemos tu viaje de *Flik-Flak* juntos! ¿En qué puedo ayudarte hoy? 😊✨',
    ],





        null,
        null,
        [flowDocs, flowGracias, flowTuto, flowDiscord,flowSecundario]
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
