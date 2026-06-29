using OpenQA.Selenium;

namespace HampiqUiTests.PageObjects;

/// <summary>
/// Formulario de registro (CU-01). Valida la identidad contra RENIEC a partir del
/// DNI y autocompleta los datos oficiales (no editables).
/// </summary>
public class RegisterPage : BasePage
{
    public RegisterPage(IWebDriver driver, int waitSeconds) : base(driver, waitSeconds) { }

    public RegisterPage ValidarDni(string dni)
    {
        Type(Tid("reg-dni"), dni);
        Click(Tid("reg-validar"));
        return this;
    }

    public bool IdentidadVerificada()
    {
        try { return WaitVisible(Tid("reg-verified")).Displayed; }
        catch (WebDriverTimeoutException) { return false; }
    }

    public string ObtenerNombres() => WaitVisible(Tid("reg-nombres")).Text.Trim();

    public string ObtenerError() => WaitVisible(Tid("reg-error")).Text.Trim();
}
