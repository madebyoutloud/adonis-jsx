import { Button, Preview, Text } from 'jsx-email'

interface Props {
  name: string
  link: string
}

export default function Password(props: Props) {
  return (
    <>
      <Preview>Reset password</Preview>

      <Text className="text-xl">Reset Password</Text>

      <Button href={props.link} width={200} height={40}>Reset Password</Button>
    </>
  )
}
