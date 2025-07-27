import { useTipCalculator } from '../tip-calculator'

describe('Tip Calculator Test Suit', () => {
  it('should correctly calculate the tip amount', () => {
    const tipCalculator = useTipCalculator()

    const tipAmountSpy = vi.spyOn(tipCalculator, 'calculateTipAmount')

    const tip = tipCalculator.calculateTipAmount(100, 0.1)

    expect(tip).toBe(10)
    expect(tipAmountSpy).toHaveBeenCalledTimes(1)
  })

  it('should correctly calculate the total based on the previously calculated tip', () => {
    const tipCalculator = useTipCalculator()

    const tipAmountSpy = vi.spyOn(tipCalculator, 'calculateTipAmount')
    const totalSpy = vi.spyOn(tipCalculator, 'calculateTotal')

    const AMOUNT = 100

    const tip = tipCalculator.calculateTipAmount(AMOUNT, 0.1)

    const total = tipCalculator.calculateTotal(AMOUNT, tip)

    expect(tip).toBe(10)
    expect(total).toBe(110)
    expect(tipAmountSpy).toHaveBeenCalledTimes(1)
    expect(totalSpy).toHaveBeenCalledTimes(1)
  })

  it('should correctly calculate the amount per person based on the previously calculated total', () => {
    const tipCalculator = useTipCalculator()

    const tipAmountSpy = vi.spyOn(tipCalculator, 'calculateTipAmount')
    const totalSpy = vi.spyOn(tipCalculator, 'calculateTotal')
    const perPersonSpy = vi.spyOn(tipCalculator, 'calculateAmountPerPerson')

    const AMOUNT = 100

    const tip = tipCalculator.calculateTipAmount(AMOUNT, 0.1)

    const total = tipCalculator.calculateTotal(AMOUNT, tip)

    const perPersonTotal = tipCalculator.calculateAmountPerPerson(total, 2)

    expect(tip).toBe(10)
    expect(total).toBe(110)
    expect(perPersonTotal).toBe(55)
    expect(tipAmountSpy).toHaveBeenCalledTimes(1)
    expect(totalSpy).toHaveBeenCalledTimes(1)
    expect(perPersonSpy).toHaveBeenCalledTimes(1)
  })
})
