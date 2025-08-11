import asyncio
from playwright.async_api import async_playwright, expect
import pathlib

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Print console messages from the page for debugging
        page.on("console", lambda msg: print(f"PAGE LOG: {msg.text}"))

        # Add a dummy token to localStorage before the page loads
        await page.add_init_script("localStorage.setItem('token', 'dummy_token')")

        # Mock the API response
        await page.route("https://platetraits.com/api/users/profile", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"success": true, "user": {"first_name": "Test", "email": "test@example.com"}}'
        ))

        # Navigate to the contact page served by the local server
        await page.goto('http://localhost:3000/contact')

        # Locate the input fields
        name_input = page.locator("#contact-name")
        email_input = page.locator("#contact-email")

        # Wait for the inputs to be populated with the correct values
        await expect(name_input).to_have_value("Test", timeout=10000)
        await expect(email_input).to_have_value("test@example.com")

        # Check if the fields are disabled
        await expect(name_input).to_be_disabled()
        await expect(email_input).to_be_disabled()

        # Take a screenshot
        await page.screenshot(path="verification.png")

        await browser.close()

asyncio.run(main())
