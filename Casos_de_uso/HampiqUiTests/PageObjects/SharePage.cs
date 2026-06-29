using OpenQA.Selenium;

namespace HampiqUiTests.PageObjects;

/// <summary>
/// Módulo "Compartir acceso" (CU-03). El paciente elige duración y número de usos,
/// genera un token temporal <c>HMPQ-XXXX-XXXX</c> y lo ve con su cuenta regresiva.
/// Los métodos devuelven <c>this</c> para encadenar las acciones (interfaz fluida).
/// </summary>
public class SharePage : BasePage
{
    public SharePage(IWebDriver driver, int waitSeconds) : base(driver, waitSeconds) { }

    public SharePage SeleccionarDuracion(int minutos)
    {
        Click(Tid($"share-duration-{minutos}"));
        return this;
    }

    public SharePage SeleccionarUsos(int usos)
    {
        Click(Tid($"share-uses-{usos}"));
        return this;
    }

    public SharePage GenerarToken()
    {
        Click(Tid("share-generate"));
        return this;
    }

    /// <summary>Espera a que aparezca el código del token generado y lo devuelve.</summary>
    public string ObtenerCodigoToken() => WaitVisible(Tid("share-token-code")).Text.Trim();

    /// <summary>Mensaje de confirmación (toast) tras generar el token.</summary>
    public string ObtenerMensajeToast() => WaitVisible(Tid("toast")).Text.Trim();

    /// <summary>Revoca el token recién generado (botón «Revocar» de la tarjeta).</summary>
    public SharePage RevocarTokenGenerado()
    {
        Click(Tid("share-revoke"));
        return this;
    }

    /// <summary>Espera hasta que el toast contenga el fragmento indicado y devuelve su texto.</summary>
    public string EsperarToastContenga(string fragmento) =>
        Wait.Until(d =>
        {
            var els = d.FindElements(Tid("toast"));
            if (els.Count == 0) return null;
            var txt = els[0].Text;
            return txt.Contains(fragmento, StringComparison.OrdinalIgnoreCase) ? txt : null;
        })!;

    /// <summary>Cierra la sesión del paciente y vuelve a la landing.</summary>
    public LandingPage CerrarSesion()
    {
        Click(Tid("logout"));
        return new LandingPage(Driver, WaitSeconds);
    }
}
