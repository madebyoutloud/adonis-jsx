interface Props {
  name: string
}

export default function Index(props: Props) {
  return (
    <div>Hello {props.name}!</div>
  )
}
