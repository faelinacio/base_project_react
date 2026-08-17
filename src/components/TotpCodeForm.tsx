import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, chakra, Field, Input, Text } from '@chakra-ui/react'

const totpSchema = z.object({
  code: z.string().min(6, 'O código deve ter 6 dígitos').max(6, 'O código deve ter 6 dígitos'),
})

type TotpForm = z.infer<typeof totpSchema>

interface TotpCodeFormProps {
  onSubmit: (code: string) => void | Promise<void>
  onBack?: () => void
  isSubmitting: boolean
}

export function TotpCodeForm({ onSubmit, onBack, isSubmitting }: TotpCodeFormProps) {
  const form = useForm<TotpForm>({ resolver: zodResolver(totpSchema) })

  return (
    <chakra.form onSubmit={form.handleSubmit((values) => onSubmit(values.code))} noValidate>
      <Text fontSize="sm" color="fg.muted" mb={3}>
        Informe o código de 6 dígitos do seu aplicativo autenticador.
      </Text>
      <Field.Root invalid={Boolean(form.formState.errors.code)} mb={2}>
        <Field.Label>Código de verificação</Field.Label>
        <Input {...form.register('code')} autoFocus inputMode="numeric" maxLength={6} />
        {form.formState.errors.code && (
          <Field.ErrorText>{form.formState.errors.code.message}</Field.ErrorText>
        )}
      </Field.Root>
      <Button type="submit" colorPalette="blue" w="full" size="lg" mt={2} loading={isSubmitting}>
        Verificar
      </Button>
      {onBack && (
        <Button variant="ghost" w="full" mt={2} onClick={onBack}>
          Voltar
        </Button>
      )}
    </chakra.form>
  )
}
