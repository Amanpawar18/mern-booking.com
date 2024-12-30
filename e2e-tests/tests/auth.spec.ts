import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173";

test("should all the user to sign in", async ({ page }) => {
  await page.goto(UI_URL);
  // get the sign in button
  await page.getByRole("link", { name: "Sign in" }).click();

  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();

  await page.locator("[name=email]").fill("testUser@gmail.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("Sign In successfull !!")).toBeVisible();

  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
});

test("Should allow all users to register", async ({ page }) => {
  const testEmail = `testEmail${Date.now()}@gmail.com`
  await page.goto(UI_URL);
  // get the sign in button
  await page.getByRole("link", { name: "Sign in" }).click();

  await page.getByRole("link", { name: "Create account here.." }).click();

  await expect(
    page.getByRole("heading", { name: "Create an account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("test_firstName");
  await page.locator("[name=lastName]").fill("test_lastName");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("123546");
  await page.locator("[name=confirmPassword]").fill("123546");

  await page.getByRole("button", { name: "Register" }).click();

  await expect(page.getByText("Registration successfull !!")).toBeVisible();

  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
});
