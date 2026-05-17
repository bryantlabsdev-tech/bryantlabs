import { expect, test } from "@playwright/test"

test("homepage loads and shows primary CTA", async ({ page }) => {
  await page.goto("/")

  await expect(page).toHaveTitle(/Bryant Labs/i)
  await expect(
    page.getByRole("heading", { name: /Modern Apps & Systems Built Fast/i }),
  ).toBeVisible()
  await expect(page.locator('a[href="/#contact"]').first()).toBeVisible()
})

test("intake form renders on homepage contact section", async ({ page }) => {
  await page.goto("/#contact")

  await page.locator("#contact").scrollIntoViewIfNeeded()
  await expect(page.getByRole("textbox", { name: "Name" })).toBeVisible()
  await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible()
  await expect(page.locator('#contact form button[type="submit"]')).toBeVisible()
})

test("admin route requires auth and redirects to login", async ({ page }) => {
  await page.goto("/admin")

  await expect(page).toHaveURL(/\/admin\/login$/)
  await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible()
  await expect(page.getByLabel("Admin email")).toBeVisible()
})
