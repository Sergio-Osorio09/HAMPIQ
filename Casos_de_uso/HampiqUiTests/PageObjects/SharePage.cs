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
}
