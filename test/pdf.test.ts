import { expect, it, vi } from 'vitest'
import { pdf } from '../src/pdf.js'

vi.mock('puppeteer', () => ({
  launch: vi.fn().mockResolvedValue({
    newPage: vi.fn().mockResolvedValue({
      setContent: vi.fn(),
      pdf: vi.fn().mockResolvedValue('pdf'),
    }),
    close: vi.fn(),
  }),
}))

it('exports a resume to PDF with no-sandbox', async () => {
  const resume = require('@jsonresume/schema/sample.resume.json')
  const theme = {
    render: vi.fn(({ basics: { name } }) => name),
  }

  await expect(pdf('html', resume, theme, true)).resolves.toBe('pdf')
})

it('exports a resume to PDF without no-sandbox', async () => {
  const resume = require('@jsonresume/schema/sample.resume.json')
  const theme = {
    render: vi.fn(({ basics: { name } }) => name),
  }

  await expect(pdf('html', resume, theme, undefined)).resolves.toBe('pdf')
})

it('asks if Puppeteer package is installed if importing fails', async () => {
  const resume = require('@jsonresume/schema/sample.resume.json')
  const theme = {
    render: vi.fn(({ basics: { name } }) => name),
  }

  await expect(() =>
    pdf('html', resume, theme, true, 'non-puppeteer'),
  ).rejects.toThrow('Could not import non-puppeteer package. Is it installed?')
})
