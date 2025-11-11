// ===========================================================
// captcha_solver.js
// ===========================================================
// Este módulo se encarga de gestionar la obtención de tokens
// de Cloudflare Turnstile para el autobot, incluyendo:
//  - Carga del script de Turnstile
//  - Detección de sitekey
//  - Generación de token de forma invisible
//  - Reintentos automáticos y fallback interactivo
// ===========================================================

const captchaSolver = (() => {
    let tokenCache = null;
    let tokenTimestamp = 0;
    const TOKEN_TTL = 90 * 1000; // 90 segundos para evitar expiración

    /**
     * Carga el script de Turnstile si no está disponible.
     */
    function loadTurnstileScript() {
        return new Promise((resolve, reject) => {
            if (window.turnstile) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('No se pudo cargar el script de Turnstile.'));
            document.head.appendChild(script);
        });
    }

    /**
     * Busca el sitekey de Turnstile en la página.
     */
    function findSiteKey() {
        const candidate = document.querySelector('[data-sitekey]');
        if (candidate) {
            return candidate.getAttribute('data-sitekey');
        }
        throw new Error('No se encontró ningún sitekey para Turnstile.');
    }

    /**
     * Ejecuta el desafío invisible de Turnstile para obtener el token.
     */
    function executeTurnstile(siteKey) {
        return new Promise((resolve, reject) => {
            const container = document.createElement('div');
            container.style.display = 'none';
            document.body.appendChild(container);

            try {
                window.turnstile.render(container, {
                    sitekey: siteKey,
                    size: 'invisible',
                    callback: (token) => {
                        resolve(token);
                        document.body.removeChild(container);
                    },
                    'error-callback': () => {
                        reject(new Error('Error en la verificación de Turnstile.'));
                        document.body.removeChild(container);
                    },
                });
                window.turnstile.execute(container);
            } catch (err) {
                reject(err);
                document.body.removeChild(container);
            }
        });
    }

    /**
     * Comprueba si el token en caché sigue siendo válido.
     */
    function isTokenValid() {
        return tokenCache && (Date.now() - tokenTimestamp) < TOKEN_TTL;
    }

    /**
     * Intenta obtener el token, con reintentos automáticos.
     */
    async function handleCaptchaWithRetry(retries = 3) {
        const siteKey = findSiteKey();
        let lastError = null;

        for (let i = 0; i < retries; i++) {
            try {
                const token = await executeTurnstile(siteKey);
                return token;
            } catch (err) {
                console.warn(`[captcha_solver] Reintento ${i + 1}/${retries} fallido:`, err);
                lastError = err;
                await new Promise(r => setTimeout(r, 2000));
            }
        }

        throw lastError || new Error('No se pudo obtener el token de Turnstile después de varios intentos.');
    }

    /**
     * Devuelve un token válido, usando caché si es posible.
     */
    async function ensureToken() {
        if (isTokenValid()) return tokenCache;

        await loadTurnstileScript();
        const token = await handleCaptchaWithRetry();
        tokenCache = token;
        tokenTimestamp = Date.now();
        return token;
    }

    return {
        ensureToken
    };
})();

// ===========================================================
// Exportación para el resto del bot
// ===========================================================
if (typeof window !== 'undefined') {
    window.captchaSolver = captchaSolver;
} else if (typeof module !== 'undefined') {
    module.exports = captchaSolver;
}
