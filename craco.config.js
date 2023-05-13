// from https://cmdcolin.github.io/posts/2022-08-22-rustwasm

module.exports = {
  eslint: null,
  webpack: {
    configure: config => {
      const wasmExtensionRegExp = /\.wasm$/
      config.resolve.extensions.push('.wasm')
      config.experiments = {
        syncWebAssembly: true,
      }

      config.module.rules.forEach(rule => {
        ;(rule.oneOf || []).forEach(oneOf => {
          if (oneOf.type === 'asset/resource') {
            oneOf.exclude.push(wasmExtensionRegExp)
          }
        })
      })

      config.resolve.fallback = {
        fs: false,
        perf_hooks: false,
        worker_threads: false
      };

      return config
    },
  },
}


