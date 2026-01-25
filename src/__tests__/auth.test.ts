// Jest example for auth service (needs jest + ts-jest setup to run)
import axios from 'axios'
import * as auth from '../services/auth'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('auth service', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    ;(global as any).localStorage = {
      store: {} as Record<string, string>,
      getItem: function (k: string) { return this.store[k] || null },
      setItem: function (k: string, v: string) { this.store[k] = v },
      removeItem: function (k: string) { delete this.store[k] },
    }
  })

  it('login stores tokens', async () => {
    mockedAxios.create.mockReturnValue(mockedAxios as any)
    mockedAxios.post.mockResolvedValue({ data: { success: true, value: { access_token: 'a', refresh_token: 'r' } } })

    const res = await auth.login('u', 'p')
    expect(res.access_token).toBe('a')
    expect(auth.getAccessToken()).toBe('a')
    expect(auth.getRefreshToken()).toBe('r')
  })
})
