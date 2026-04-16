# AdonisJS JSX

JSX support for [AdonisJS](https://adonisjs.com/) 6/7.

<p>

[![typescript-image]][typescript-url]
[![npm-image]][npm-url]
[![npm-download-image]][npm-download-url]
[![license-image]][license-url]

</p>

---
## Features
- Render React JSX components to HTML on the server.
- Share global and request-scoped state with templates.
- Integrates with AdonisJS Mail for email templating.
- Support for custom render functions (e.g., [jsx-email](https://jsx.email/), [react-email](https://react.email/)).
- Type-safe configuration and template props.

## Getting Started

Install the package from the npm registry and configure it.

```bash
node ace add @outloud/adonis-jsx
```

Then add `"jsx": "react-jsx"` to your `tsconfig.json` compiler options.

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

See `config/jsx.ts` for available configuration options.

## Usage

### Rendering views

Use the `jsx` property on the HTTP context to render JSX templates in your controllers.

```ts
import type { HttpContext } from '@adonisjs/core/http'

export default class TestController {
  index({ jsx }: HttpContext) {
    return jsx.render(() => import('#views/index'), { name: 'Adonis' })
  }
}
```

Define your view as a default-exported React component.

```tsx
// resources/views/index.tsx

interface Props {
  name: string
}

export default function Index(props: Props) {
  return (
    <div>Hello {props.name}!</div>
  )
}
```

### Global state

You can share global state with all templates using the `JsxEngine` service. The `app` and `config` globals are automatically injected by the provider.

```ts
// providers/app.provider.ts

import type { ApplicationService } from '@adonisjs/core/types'
import type { I18n } from '@adonisjs/i18n'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const i18n = await this.app.container.make('i18n')
    const jsx = await this.app.container.make('jsx')

    jsx.global('i18n', i18n.locale(i18n.defaultLocale))
    jsx.global('brandName', 'Acme')
  }
}

declare module '@outloud/adonis-jsx' {
  export interface GlobalState {
    i18n: I18n
    brandName: string
  }
}

```

Access global state in your templates using the `GlobalContext` or `HttpContext` context.

```tsx
import { useContext } from 'react'
import { HttpContext } from '@outloud/adonis-jsx'

export default function Header() {
  // if you are rendering the template from a controller,
  // you can also use HttpContext to access request-scoped state
  const { brandName } = useContext(HttpContext)
  return <h1>{brandName}</h1>
}
```

### Usage outside of controllers
You can also use the `JsxEngine` service to render templates outside of controllers, such as in scheduled tasks or event listeners.

```ts
import jsx from '@outloud/adonis-jsx/service'

const html = await jsx.render(() => import('#views/email'), { name: 'John' })
```

## Mail integration

> [!NOTE]
> This requires [@adonisjs/mail](https://docs.adonisjs.com/guides/digging-deeper/mail) package (v10.2.0+) to be installed and configured.

The package automatically integrates with AdonisJS Mail when detected. Use `htmlView()` on the message to render a JSX email template.

```ts
import mail from '@adonisjs/mail/services/main'

await mail.send((message) => {
  message
    .to('user@example.com')
    .subject('Reset Password')
    .htmlView(() => import('#emails/password'), {
      name: 'John',
      link: 'https://example.com/reset',
    })
})
```

Define your email template as a React component.

```tsx
// resources/emails/password.tsx
import { useContext } from 'react'
import { GlobalContext } from '@outloud/adonis-jsx'

interface Props {
  name: string
  link: string
}

export default function Password(props: Props) {
  const { brandName } = useContext(GlobalContext)

  return (
    <>
      <h1>{brandName}</h1>

      <p>Hi {props.name},</p>
      <a href={props.link}>Reset Password</a>
    </>
  )
}
```

### react-email support
Install the `@react-email/render` package and configure a custom render function.

```ts
// config/jsx.ts

import { render } from '@react-email/render'
import { defineConfig } from '@outloud/adonis-jsx'

const jsxConfig = defineConfig({
  mail: {
    render: (template) => render(template),
  }
})
```

### jsx-email support
Using `jsx-email` requires an extra step: create a custom context and pass it to the JSX engine configuration.

```ts
// resources/emails/contexts/email.context.ts

import type { GlobalState } from '@outloud/adonis-jsx'
import { createContext } from 'jsx-email'

export const EmailContext = createContext<GlobalState>({} as GlobalState)
```

```ts
// config/jsx.ts

import { render } from 'jsx-email'
import { defineConfig } from '@outloud/adonis-jsx'
import { EmailContext } from '#emails/contexts/email.context'

const jsxConfig = defineConfig({
  mail: {
    context: EmailContext,
    render: (template) => render(template, { inlineCss: true }),
  }
})
```

[npm-image]: https://badgen.net/npm/v/@outloud/adonis-jsx/latest
[npm-url]: https://npmjs.org/package/@outloud/adonis-jsx "npm"

[npm-download-image]: https://badgen.net/npm/dm/@outloud/adonis-jsx
[npm-download-url]: https://npmcharts.com/compare/@outloud/adonis-jsx?minimal=true "downloads"

[typescript-image]: https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org "TypeScript"

[license-image]: https://img.shields.io/npm/l/@outloud/adonis-jsx.svg?sanitize=true
[license-url]: LICENSE.md "license"
