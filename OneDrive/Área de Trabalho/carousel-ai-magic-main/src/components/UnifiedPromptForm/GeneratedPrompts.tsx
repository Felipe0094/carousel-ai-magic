  <div className="flex items-center gap-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        navigator.clipboard.writeText(prompt);
        toast.success("Prompt copiado!");
      }}
      className="h-8 px-3 bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white"
    >
      <Copy className="h-4 w-4 mr-2" />
      Copiar
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        navigator.clipboard.writeText(prompt);
        toast.success("Link copiado!");
      }}
      className="h-8 px-3 bg-feijo-gray/10 border-feijo-gray text-feijo-gray hover:bg-feijo-gray hover:text-white"
    >
      <Share2 className="h-4 w-4 mr-2" />
      Compartilhar
    </Button>
  </div> 