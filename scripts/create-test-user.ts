/**
 * Script para criar usuário de teste no Supabase
 *
 * Execute: npx tsx scripts/create-test-user.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key para admin

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestUser() {
  const email = 'teste@auralux.com'
  const password = 'Auralux123!'

  console.log('🔐 Criando usuário de teste...')
  console.log('Email:', email)
  console.log('Senha:', password)

  try {
    // Criar usuário usando Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        name: 'Usuário Teste',
      }
    })

    if (error) {
      console.error('❌ Erro ao criar usuário:', error.message)

      if (error.message.includes('already registered')) {
        console.log('ℹ️  Usuário já existe! Use as credenciais:')
        console.log('   Email:', email)
        console.log('   Senha:', password)
      }
      return
    }

    console.log('✅ Usuário criado com sucesso!')
    console.log('ID:', data.user.id)
    console.log('')
    console.log('📝 Use estas credenciais para fazer login:')
    console.log('   Email:', email)
    console.log('   Senha:', password)
    console.log('')
    console.log('🌐 Acesse: http://localhost:3000/login')

  } catch (err) {
    console.error('❌ Erro:', err)
  }
}

createTestUser()
